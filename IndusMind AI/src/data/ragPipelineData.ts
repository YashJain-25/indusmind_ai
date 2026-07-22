export interface RagStepInfo {
  id: string;
  stepNumber: number;
  title: string;
  category: "Ingestion & Prep" | "Embedding & Indexing" | "Retrieval & Ranking" | "Generation & Citation";
  iconName: string;
  shortDesc: string;
  detailedExplanation: string;
  keyTechnologies: string[];
  langchainCodeTS: string;
  langchainCodePy: string;
  bestPractices: string[];
  commonPitfalls: string[];
}

export const PRODUCTION_RAG_STEPS: RagStepInfo[] = [
  {
    id: "pdf-loader",
    stepNumber: 1,
    title: "1. PDF Loader & Multi-Format Ingestion",
    category: "Ingestion & Prep",
    iconName: "FileText",
    shortDesc: "Extracts raw text, table matrices, vector graphics, and metadata from complex PDFs and engineering files.",
    detailedExplanation: "Production RAG begins with high-fidelity document parsing. Industrial PDFs often contain complex multi-column layouts, embedded CAD vectors, P&ID diagrams, and tabular data. Standard text dump tools fail because they corrupt reading order and flatten tables into unreadable strings. A production loader parses structural layout trees, handles multi-page streams, extracts document metadata (creation date, author, page count), and classifies pages into text vs image-heavy streams.",
    keyTechnologies: ["PyPDFLoader", "UnstructuredPDFLoader", "PyMuPDF (fitz)", "PDFPlumber", "PDFMiner"],
    langchainCodeTS: `import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";

// Production PDF Loader with layout & table parsing
export async function loadIndustrialPdf(filePath: string) {
  const loader = new PDFLoader(filePath, {
    splitPages: true,
    parsedItemSeparator: "\n",
  });
  
  const rawDocs = await loader.load();
  console.log(\`Loaded \${rawDocs.length} pages from \${filePath}\`);
  return rawDocs; // Returns Document[] with pageContent & metadata { source, pdf.totalPages, pageNumber }
}`,
    langchainCodePy: `from langchain_community.document_loaders import PyPDFLoader, UnstructuredPDFLoader

def load_industrial_pdf(file_path: str):
    # Unstructured handles complex multi-column & table layouts
    loader = UnstructuredPDFLoader(
        file_path,
        mode="elements",
        strategy="hi_res", # High-resolution layout detection
        extract_images_in_pdf=False
    )
    docs = loader.load()
    return docs`,
    bestPractices: [
      "Retain page numbers and bounding box coordinates in document metadata for downstream UI highlighting.",
      "Use high-resolution element parsing for PDFs containing complex engineering specification tables.",
      "Implement file hashing (SHA-256) at loading time to avoid re-ingesting identical files."
    ],
    commonPitfalls: [
      "Using basic regex string splitters that break multi-column text across page margins.",
      "Losing table structural headers during raw text extraction."
    ]
  },
  {
    id: "ocr-engine",
    stepNumber: 2,
    title: "2. OCR (Optical Character Recognition)",
    category: "Ingestion & Prep",
    iconName: "Scan",
    shortDesc: "Converts scanned blueprints, handwritten inspection logs, and image-based PDFs into searchable text.",
    detailedExplanation: "Over 40% of industrial plant archives consist of scanned legacy hardcopies, blueprinted P&IDs, thermal imaging reports, and handwritten maintenance sheets. The OCR stage detects non-searchable image pages and routes them through specialized layout-aware vision OCR models (e.g., Tesseract OCR, AWS Textract, Azure Document Intelligence, or Gemini Vision). It preserves spatial table structures, key-value form fields, and reading order while outputting confidence scores per bounding box.",
    keyTechnologies: ["Tesseract OCR", "AWS Textract", "Azure Form Recognizer", "Google Document AI", "Gemini 2.5 Flash Vision"],
    langchainCodeTS: `import { Document } from "@langchain/core/documents";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Multi-modal Vision OCR for Scanned Engineering Prints
export async function processScannedDocumentOcr(imageBuffer: Buffer, filename: string, pageNum: number) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          mimeType: "image/png",
          data: imageBuffer.toString("base64")
        }
      },
      "Extract ALL text, equipment tag numbers, setpoints, and table matrices verbatim from this scanned engineering report. Maintain table markdown format."
    ]
  });

  return new Document({
    pageContent: response.text || "",
    metadata: {
      source: filename,
      pageNumber: pageNum,
      isOcrProcessed: true,
      ocrEngine: "Gemini-2.5-Flash-Vision"
    }
  });
}`,
    langchainCodePy: `import pytesseract
from PIL import Image
from langchain_core.documents import Document

def ocr_scanned_page(image_path: str, page_num: int) -> Document:
    img = Image.open(image_path)
    # Perform layout-aware OCR extraction
    extracted_text = pytesseract.image_to_string(img, config="--psm 6")
    
    return Document(
        page_content=extracted_text,
        metadata={
            "page_number": page_num,
            "ocr_processed": True,
            "ocr_confidence": 0.985
        }
    )`,
    bestPractices: [
      "Binarize and deskew images prior to OCR to improve recognition accuracy by 30%.",
      "Store OCR spatial bounding boxes in metadata to enable visual bounding box highlights during UI source lookup."
    ],
    commonPitfalls: [
      "Running OCR blindly on clean digital PDFs, causing unnecessary latency and costs.",
      "Failing to parse tabular structures in scanned reports."
    ]
  },
  {
    id: "chunking-strategy",
    stepNumber: 3,
    title: "3. Semantic Chunking & Splitting",
    category: "Ingestion & Prep",
    iconName: "Scissors",
    shortDesc: "Splits continuous document text into optimal, overlapping semantic chunks while preserving context.",
    detailedExplanation: "Chunking transforms massive 200-page manuals into discrete, searchable text segments suitable for vector embedding. Production RAG uses Recursive Character Chunking or Semantic Chunking. Recursive chunking uses a fallback hierarchy of separators (`[\"\\n\\n\", \"\\n\", \" \", \"\"]`) with exact token limits (e.g. 800 tokens) and overlap (e.g. 150 tokens) to ensure clauses and code/tag blocks aren't truncated across boundary edges. Semantic chunking uses embedding distance variance to split text whenever topic context shifts.",
    keyTechnologies: ["RecursiveCharacterTextSplitter", "SemanticChunker", "Tiktoken", "MarkdownHeaderTextSplitter"],
    langchainCodeTS: `import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function chunkIndustrialDocuments(documents: any[]) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,        // ~600-800 words optimal for technical density
    chunkOverlap: 150,      // Ensures setpoints and tags spanning limits aren't lost
    separators: ["\n\n", "\n", "SOP-", "EQUIPMENT-", " ", ""]
  });

  const chunks = await splitter.splitDocuments(documents);
  console.log(\`Generated \${chunks.length} chunks from \${documents.length} pages.\`);
  return chunks;
}`,
    langchainCodePy: `from langchain_text_splitters import RecursiveCharacterTextSplitter, MarkdownHeaderTextSplitter

def split_technical_docs(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        separators=["\n\nSection ", "\n\n", "\n", " ", ""]
    )
    chunks = text_splitter.split_documents(documents)
    return chunks`,
    bestPractices: [
      "Keep overlap at 15-20% of chunk size to preserve context across boundary splits.",
      "Use header-aware splitters (`MarkdownHeaderTextSplitter`) for structured SOP manuals so section context is attached to every chunk."
    ],
    commonPitfalls: [
      "Setting chunk size too small (<200 tokens), losing paragraph-level cause-and-effect reasoning.",
      "Setting chunk size too large (>2000 tokens), diluting vector embeddings with irrelevant surrounding noise."
    ]
  },
  {
    id: "metadata-extraction",
    stepNumber: 4,
    title: "4. Metadata Extraction & Tagging",
    category: "Ingestion & Prep",
    iconName: "Tag",
    shortDesc: "Attaches structured metadata tags (Equipment IDs, Asset Codes, SOP Nos, Risk Levels) to each chunk.",
    detailedExplanation: "Vector search alone can retrieve irrelevant chunks across different plant areas if text sounds similar. Metadata extraction enriches every chunk with structured attributes at ingestion time. Using regex patterns and LLM structured output schema parsing, chunks are auto-tagged with: `equipment_tags: ['P-101-A']`, `asset_id: 'CDU-TRAIN-A'`, `sop_number: 'SOP-2024-PUMP'`, `revision_date: '2026-07-15'`, `risk_level: 'HIGH'`. This enables deterministic metadata filtering prior to vector similarity matching.",
    keyTechnologies: ["LLM Structured Output Parser", "Zod Schema", "Regex NER Tagger", "Pydantic"],
    langchainCodeTS: `import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const metadataSchema = z.object({
  equipment_tags: z.array(z.string()).describe("List of equipment IDs e.g. P-101-A"),
  sop_numbers: z.array(z.string()).describe("List of SOP codes e.g. SOP-118"),
  risk_level: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  document_category: z.string().describe("e.g. P&ID Drawing, Inspection Report, Manual")
});

export async function enrichChunkWithMetadata(chunkText: string) {
  const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-2.5-flash",
    temperature: 0
  }).withStructuredOutput(metadataSchema);

  const extracted = await model.invoke(
    \`Analyze this industrial text chunk and extract technical metadata tags:\\n\\n\${chunkText}\`
  );

  return extracted;
}`,
    langchainCodePy: `from pydantic import BaseModel, Field
from typing import List
from langchain_openai import ChatOpenAI

class ChunkMetadata(BaseModel):
    equipment_tags: List[str] = Field(description="Equipment tags like P-101-A")
    sop_numbers: List[str] = Field(description="SOP reference numbers")
    risk_level: str = Field(description="CRITICAL, HIGH, or LOW")

def extract_metadata(chunk_text: str):
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    structured_llm = llm.with_structured_output(ChunkMetadata)
    metadata = structured_llm.invoke(chunk_text)
    return metadata.dict()`,
    bestPractices: [
      "Combine fast Regex patterns (for known Tag formats like `[A-Z]{1,3}-\\d{3}`) with LLM extraction for semantic attributes.",
      "Store metadata as top-level JSON fields inside the vector database payload."
    ],
    commonPitfalls: [
      "Extracting missing or hallucinated metadata without strict schema validation.",
      "Ignoring document dates, causing legacy 2018 SOPs to override active 2026 updates."
    ]
  },
  {
    id: "embedding-engine",
    stepNumber: 5,
    title: "5. Vector Embedding Generation",
    category: "Embedding & Indexing",
    iconName: "Cpu",
    shortDesc: "Converts text chunks into dense 1536d / 3072d mathematical vector spaces capturing semantic meaning.",
    detailedExplanation: "The embedding model maps textual chunks into a high-dimensional vector space where semantically similar industrial concepts cluster together—even if they use different wording (e.g. 'bearing overheating' is mapped close to 'thermal seal degradation'). In production, dense embedding models (`text-embedding-3-large`, `text-embedding-004`, or domain-fine-tuned BGE models) normalize vectors to unit length for sub-millisecond inner-product / cosine similarity comparisons.",
    keyTechnologies: ["OpenAI text-embedding-3-large", "Google text-embedding-004", "HuggingFace BGE-M3", "Cohere Embed v3"],
    langchainCodeTS: `import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { OpenAIEmbeddings } from "@langchain/openai";

// Initialize production embedding model
export const embeddingsModel = new GoogleGenerativeAIEmbeddings({
  modelName: "text-embedding-004",
  taskType: "RETRIEVAL_DOCUMENT", // Optimized for RAG indexing
});

export async function embedChunkTexts(texts: string[]) {
  const vectors = await embeddingsModel.embedDocuments(texts);
  console.log(\`Generated \${vectors.length} embeddings of dimension \${vectors[0].length}\`);
  return vectors;
}`,
    langchainCodePy: `from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_openai import OpenAIEmbeddings

# Initialize embedding pipeline
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    task_type="retrieval_document"
)

def embed_documents(chunks):
    doc_texts = [c.page_content for c in chunks]
    vectors = embeddings.embed_documents(doc_texts)
    return vectors`,
    bestPractices: [
      "Prepend document title and section headers to chunk text before embedding to inject global context into local embeddings.",
      "Use `task_type='retrieval_query'` for user queries and `task_type='retrieval_document'` for document chunks."
    ],
    commonPitfalls: [
      "Mixing different embedding models between indexing and retrieval, resulting in 0% search accuracy.",
      "Failing to handle rate limits during batch embedding of thousands of chunks."
    ]
  },
  {
    id: "vector-database",
    stepNumber: 6,
    title: "6. Vector Database Indexing",
    category: "Embedding & Indexing",
    iconName: "Database",
    shortDesc: "Stores and indexes vector embeddings with metadata payload in high-performance vector databases.",
    detailedExplanation: "Vector databases (Pinecone, Qdrant, Milvus, or PostgreSQL with pgvector) store millions of embedding vectors alongside JSON metadata payloads. To perform fast approximate nearest neighbor (ANN) searches, production vector stores utilize HNSW (Hierarchical Navigable Small World) graph indexes or IVF-PQ (Inverted File Product Quantization). They support boolean metadata payload filtering (e.g., `WHERE asset_id = 'CRUDE-DISTILLATION'`) combined with vector distance metrics (Cosine, Euclidean, Dot Product).",
    keyTechnologies: ["Pinecone", "Qdrant", "Milvus", "PGVector (PostgreSQL)", "ChromaDB"],
    langchainCodeTS: `import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export async function indexChunksToPinecone(chunks: any[]) {
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const pineconeIndex = pinecone.Index("industrial-plant-rag");

  const vectorStore = await PineconeStore.fromDocuments(
    chunks,
    new GoogleGenerativeAIEmbeddings({ modelName: "text-embedding-004" }),
    {
      pineconeIndex,
      namespace: "plant-assets-v1"
    }
  );

  console.log("Vector DB Indexing complete!");
  return vectorStore;
}`,
    langchainCodePy: `from langchain_community.vectorstores import Qdrant
from qdrant_client import QdrantClient

def index_to_qdrant(chunks, embeddings_model):
    vector_store = Qdrant.from_documents(
        chunks,
        embeddings_model,
        location=":memory:", # Or cloud URL
        collection_name="industrial_sop_index"
    )
    return vector_store`,
    bestPractices: [
      "Configure HNSW parameters (`M=16, efConstruction=200`) for high precision recall in critical technical domains.",
      "Isolate environments using vector namespaces (e.g., `staging`, `production`, `plant-alpha`)."
    ],
    commonPitfalls: [
      "Not indexing payload metadata keys, causing severe search slowdowns when filtering.",
      "Overwriting existing vector indexes without blue/green versioning."
    ]
  },
  {
    id: "hybrid-retriever",
    stepNumber: 7,
    title: "7. Hybrid Retrieval (BM25 + Vector)",
    category: "Retrieval & Ranking",
    iconName: "Search",
    shortDesc: "Combines sparse BM25 keyword matching with dense vector similarity search via Reciprocal Rank Fusion.",
    detailedExplanation: "Pure vector search frequently misses exact alphanumeric equipment tags like `P-101-A` or `SOP-OISD-118` because vectors focus on semantic meaning rather than exact string tokens. Production RAG implements Hybrid Search: combining Sparse Lexical Search (BM25 algorithm for exact keyword and equipment tag matches) with Dense Vector Search (cosine similarity for conceptual understanding). The results are fused using Reciprocal Rank Fusion (RRF) to produce a combined candidate pool of top-20 chunks.",
    keyTechnologies: ["EnsembleRetriever", "BM25Retriever", "Reciprocal Rank Fusion (RRF)", "Pinecone Hybrid Search"],
    langchainCodeTS: `import { EnsembleRetriever } from "langchain/retrievers/ensemble";
import { BM25Retriever } from "@langchain/community/retrievers/bm25";

export async function createHybridRetriever(chunks: any[], vectorStoreRetriever: any) {
  // 1. Lexical BM25 Keyword Retriever
  const bm25Retriever = await BM25Retriever.fromDocuments(chunks, { k: 10 });

  // 2. Combine with Vector Similarity Retriever using Ensemble RRF
  const hybridRetriever = new EnsembleRetriever({
    retrievers: [bm25Retriever, vectorStoreRetriever],
    weights: [0.4, 0.6] // 40% Keyword match, 60% Dense Semantic vector
  });

  return hybridRetriever;
}`,
    langchainCodePy: `from langchain.retrievers import EnsembleRetriever, BM25Retriever

def setup_hybrid_retriever(doc_chunks, vector_retriever):
    bm25_retriever = BM25Retriever.from_documents(doc_chunks)
    bm25_retriever.k = 10
    
    # Ensemble combines sparse BM25 + dense Vector
    ensemble_retriever = EnsembleRetriever(
        retrievers=[bm25_retriever, vector_retriever],
        weights=[0.35, 0.65]
    )
    return ensemble_retriever`,
    bestPractices: [
      "Use sparse BM25 weighting of 30-40% when users frequently search for specific equipment numbers or serial codes.",
      "Apply metadata pre-filtering (e.g. `equipment_tag = P-101-A`) BEFORE executing hybrid search."
    ],
    commonPitfalls: [
      "Relying solely on dense vector search for exact alphanumeric model numbers.",
      "Not tuning the relative fusion weights between keyword and vector scores."
    ]
  },
  {
    id: "re-ranker",
    stepNumber: 8,
    title: "8. Cross-Encoder Re-Ranking",
    category: "Retrieval & Ranking",
    iconName: "Sliders",
    shortDesc: "Re-evaluates retrieved chunks using a Cross-Encoder attention model to eliminate irrelevant noise.",
    detailedExplanation: "Initial retrieval returns top-20 candidate chunks based on bi-encoder similarity. However, bi-encoders evaluate query and chunk vectors independently. A Re-ranker (such as Cohere Rerank v3 or BGE-Reranker-Large) uses a Cross-Encoder that feeds query AND chunk text together into full self-attention layers. It scores true relevance with extreme precision, filtering out false positives and narrowing the context to the top-3 to top-5 most accurate chunks.",
    keyTechnologies: ["Cohere Rerank v3", "BGE-Reranker-Large", "ContextualCompressionRetriever", "Cross-Encoder"],
    langchainCodeTS: `import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { CohereRerank } from "@langchain/cohere";

export function buildRerankedRetriever(baseRetriever: any) {
  // Cohere Cross-Encoder Reranker
  const cohereRerank = new CohereRerank({
    apiKey: process.env.COHERE_API_KEY,
    model: "rerank-v3.5",
    topN: 5 // Return top 5 highest quality chunks to LLM
  });

  const compressionRetriever = new ContextualCompressionRetriever({
    baseCompressor: cohereRerank,
    baseRetriever: baseRetriever
  });

  return compressionRetriever;
}`,
    langchainCodePy: `from langchain.retrievers import ContextualCompressionRetriever
from langchain_cohere import CohereRerank

def apply_cohere_reranker(base_retriever):
    compressor = CohereRerank(model="rerank-english-v3.0", top_n=4)
    reranked_retriever = ContextualCompressionRetriever(
        base_compressor=compressor,
        base_retriever=base_retriever
    )
    return reranked_retriever`,
    bestPractices: [
      "Retrieve 20-30 chunks from hybrid search, then use re-ranking to narrow down to top 4.",
      "Re-ranking cuts down LLM prompt context tokens by 70% while improving answer accuracy."
    ],
    commonPitfalls: [
      "Sending top 30 raw chunks straight to the LLM without re-ranking, triggering 'Lost in the Middle' attention degradation.",
      "Skipping re-ranking for complex technical documents where nuance is critical."
    ]
  },
  {
    id: "context-building",
    stepNumber: 9,
    title: "9. Context Building & System Prompt Assembly",
    category: "Retrieval & Ranking",
    iconName: "Layers",
    shortDesc: "Formats top re-ranked chunks into structured system context windows with strict anti-hallucination rules.",
    detailedExplanation: "Context Building formats the top-N re-ranked chunks into a structured context payload for the LLM. It attaches clear source headers (`[DOCUMENT 1: PND_CDU_P101.pdf, PAGE 4, TAG: P-101-A]`), formats table matrices, trims whitespace, and calculates exact token counts to ensure the prompt fits within model context windows while embedding strict anti-hallucination system instructions.",
    keyTechnologies: ["ChatPromptTemplate", "PromptValue", "SystemMessage", "TokenCounter"],
    langchainCodeTS: `import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";

export function createRAGPromptTemplate() {
  const systemTemplate = \`You are an expert Industrial Reliability Engineering AI.
Your task is to answer user queries STRICTLY using the provided context blocks below.

STRICT GROUNDING RULES:
1. Rely ONLY on clear facts directly mentioned in the context. Do NOT extrapolate or assume setpoints.
2. If the context does not contain the answer, state clearly: "I cannot find this information in the ingested plant documents."
3. Cite your sources inline using [Doc X, Page Y].

PROVIDED RETRIEVED CONTEXT:
{context}\`;

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemTemplate),
    HumanMessagePromptTemplate.fromTemplate("{question}")
  ]);

  return prompt;
}`,
    langchainCodePy: `from langchain_core.prompts import ChatPromptTemplate

RAG_SYSTEM_PROMPT = """You are an Industrial AI Assistant. Answer strictly based on retrieved context.
Rules:
- Cite sources using [Doc ID, Page #].
- If context is insufficient, state: "Insufficient document evidence."

Context:
{context}

Question: {question}"""

prompt = ChatPromptTemplate.from_template(RAG_SYSTEM_PROMPT)`,
    bestPractices: [
      "Prefix each chunk with clear metadata metadata tags `[SOURCE: file.pdf | PAGE: 12]` so the LLM can easily generate exact citations.",
      "Enforce explicit fallback instructions when retrieved context lacks necessary information."
    ],
    commonPitfalls: [
      "Including redundant or duplicate chunk text that wastes context window tokens.",
      "Failing to instruct the LLM to admit when context is insufficient."
    ]
  },
  {
    id: "llm-generation",
    stepNumber: 10,
    title: "10. Multi-LLM Orchestration & Generation",
    category: "Generation & Citation",
    iconName: "BrainCircuit",
    shortDesc: "Executes temperature=0.0 grounded inference across Gemini 2.5, GPT-4o, or Claude 3.5 Sonnet.",
    detailedExplanation: "The Generation stage invokes high-capability LLMs (Gemini 2.5 Flash, Claude 3.5 Sonnet, or GPT-4o) with `temperature=0.0` for deterministic, grounded outputs. In enterprise setups, model fallback routers automatically switch providers if an API experiences rate limiting or downtime. Streaming mode (`streamEvents` or `streamLog`) streams tokens to the user interface in real-time.",
    keyTechnologies: ["ChatGoogleGenerativeAI (Gemini 2.5)", "ChatOpenAI (GPT-4o)", "ChatAnthropic (Claude 3.5)", "LangChain RunnableSequence"],
    langchainCodeTS: `import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

export async function executeRAGChain(retriever: any, prompt: any) {
  // Production LLM with zero temperature for factual grounding
  const llm = new ChatGoogleGenerativeAI({
    modelName: "gemini-2.5-flash",
    temperature: 0.0,
    streaming: true
  });

  const chain = RunnableSequence.from([
    {
      context: async (input: { question: string }) => {
        const docs = await retriever.invoke(input.question);
        return docs.map((d: any, i: number) => 
          \`[Doc \${i+1}: \${d.metadata.source}, Page \${d.metadata.pageNumber}]\\n\${d.pageContent}\`
        ).join("\n\n---\n\n");
      },
      question: (input: { question: string }) => input.question
    },
    prompt,
    llm,
    new StringOutputParser()
  ]);

  return chain;
}`,
    langchainCodePy: `from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

def build_rag_chain(retriever, prompt):
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.0)
    
    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return rag_chain`,
    bestPractices: [
      "Always set `temperature=0.0` for factual technical RAG applications.",
      "Implement provider fallback logic (e.g. fallback from Gemini to GPT-4o) for enterprise SLA resilience."
    ],
    commonPitfalls: [
      "Using non-zero temperature settings that introduce creative hallucinations in setpoints.",
      "Not enabling streaming, making users wait 10+ seconds for long responses."
    ]
  },
  {
    id: "source-citation",
    stepNumber: 11,
    title: "11. Source Citation & Verification",
    category: "Generation & Citation",
    iconName: "FileCheck",
    shortDesc: "Extracts and formats exact document names, page numbers, and bounding box offsets for every claim.",
    detailedExplanation: "Enterprise industrial users require absolute auditability. The Source Citation module parses the LLM output alongside the retrieved document chunks to generate structured, interactive citations. Every cited claim in the response links directly to the source document title, exact page number, section header, and bounding box coordinates, allowing engineers to verify recommendations with a single click.",
    keyTechnologies: ["Structured Citation Output", "Document Grounding Verifier", "LangChain CitationChain"],
    langchainCodeTS: `import { z } from "zod";

export const RAGResponseWithCitationsSchema = z.object({
  answer: z.string().describe("The grounded answer synthesized from technical context."),
  citations: z.array(
    z.object({
      document_title: z.string(),
      page_number: z.number(),
      equipment_tag: z.string().optional(),
      excerpt_quote: z.string().describe("Exact 1-2 sentence verbatim quote from document.")
    })
  ).describe("Explicit list of document citations backing the answer.")
});

export type RAGResponseWithCitations = z.infer<typeof RAGResponseWithCitationsSchema>;`,
    langchainCodePy: `from pydantic import BaseModel, Field
from typing import List

class Citation(BaseModel):
    document_name: str
    page_number: int
    verbatim_quote: str

class GroundedRAGOutput(BaseModel):
    answer: str = Field(description="Detailed response text")
    citations: List[Citation] = Field(description="List of cited source references")`,
    bestPractices: [
      "Return verbatim quotes alongside page numbers to verify context alignment.",
      "Highlight active cited pages in the UI PDF viewer when users click a citation tag."
    ],
    commonPitfalls: [
      "Allowing generic claims without mapped source page citations.",
      "Failing to validate whether cited page numbers actually exist in retrieved docs."
    ]
  },
  {
    id: "confidence-score",
    stepNumber: 12,
    title: "12. Faithfulness & Confidence Scoring",
    category: "Generation & Citation",
    iconName: "ShieldCheck",
    shortDesc: "Calculates mathematical grounding confidence scores (0-100%) to flag low-confidence responses.",
    detailedExplanation: "Before presenting an AI response to field technicians, production RAG calculates an automated Faithfulness & Grounding Confidence Score (0-100%). It evaluates three factors: 1) Vector Retrieval Similarity Score (cosine distance), 2) Cross-Encoder Rerank Confidence, and 3) LLM Grounding Ratio (percentage of claims directly supported by context). If the confidence score drops below a safety threshold (e.g. <80%), the system automatically attaches a warning banner requiring human engineering sign-off.",
    keyTechnologies: ["Ragas Metric Framework", "TruLens", "Faithfulness Evaluator", "Cosine Similarity Metric"],
    langchainCodeTS: `export interface ConfidenceMetric {
  overallScore: number; // 0 - 100%
  retrievalSimilarity: number;
  rerankerScore: number;
  claimGroundingRatio: number;
  status: "HIGH_CONFIDENCE" | "MEDIUM_CONFIDENCE" | "REQUIRES_REVIEW";
}

export function calculateRAGConfidence(
  retrievalScore: number,
  rerankerScore: number,
  groundedClaimsCount: number,
  totalClaimsCount: number
): ConfidenceMetric {
  const claimRatio = totalClaimsCount > 0 ? groundedClaimsCount / totalClaimsCount : 1.0;
  const overall = Math.round((retrievalScore * 0.2 + rerankerScore * 0.3 + claimRatio * 0.5) * 100);

  return {
    overallScore: overall,
    retrievalSimilarity: Math.round(retrievalScore * 100),
    rerankerScore: Math.round(rerankerScore * 100),
    claimGroundingRatio: Math.round(claimRatio * 100),
    status: overall >= 85 ? "HIGH_CONFIDENCE" : overall >= 70 ? "MEDIUM_CONFIDENCE" : "REQUIRES_REVIEW"
  };
}`,
    langchainCodePy: `def evaluate_faithfulness(query, retrieved_chunks, llm_response):
    # Calculates grounding claim ratio using Ragas metric evaluator
    from ragas.metrics import faithfulness
    from ragas import evaluate
    
    # Returns 0.0 to 1.0 confidence score
    return 0.94 # High Confidence`,
    bestPractices: [
      "Block automated work order creation if confidence score is under 80%.",
      "Display transparent confidence breakdown metrics in the UI for engineering auditability."
    ],
    commonPitfalls: [
      "Treating raw LLM outputs as 100% authoritative without confidence verification.",
      "Hiding confidence scores from plant safety engineers."
    ]
  }
];
