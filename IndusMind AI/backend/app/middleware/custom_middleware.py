import time
import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging_config import logger

class RequestContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        start_time = time.time()
        
        request.state.request_id = request_id
        logger.info(f"Incoming [{request.method}] {request.url.path} - RequestID: {request_id}")
        
        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time-MS"] = f"{process_time:.2f}"
            
            logger.info(f"Completed [{request.method}] {request.url.path} - Status: {response.status_code} in {process_time:.2f}ms")
            return response
        except Exception as exc:
            process_time = (time.time() - start_time) * 1000
            logger.error(f"Error [{request.method}] {request.url.path}: {str(exc)} after {process_time:.2f}ms")
            raise exc
