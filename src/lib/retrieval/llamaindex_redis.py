#!/usr/bin/env python3
"""
LlamaIndex + Redis integration for Auto RFP system
"""
import os
import json
import sys
from typing import List, Dict, Any
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Document
from llama_index.vector_stores.redis import RedisVectorStore
from llama_index.core.vector_stores.types import VectorStoreQuery
from redisvl.schema.schema import IndexSchema
from llama_index.core import StorageContext
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

class LlamaIndexRedisRetrieval:
    def __init__(self, redis_url: str = "redis://localhost:6379", index_name: str = "rfp_context"):
        self.redis_url = redis_url
        self.index_name = index_name
        
        # Set OpenAI API key from environment
        openai_key = os.getenv('OPENAI_API_KEY')
        if not openai_key:
            raise ValueError("OPENAI_API_KEY environment variable not set")
        
        os.environ['OPENAI_API_KEY'] = openai_key
        self.embed_model = OpenAIEmbedding()
        self.llm = OpenAI(temperature=0.1, model="gpt-3.5-turbo")
        self.vector_store = None
        self.index = None
        
    def connect(self):
        """Connect to Redis and initialize vector store"""
        try:
            # Use a simpler approach for now - fallback to local storage
            # This will work for the demo without requiring complex Redis setup
            print("Using fallback mode - LlamaIndex with local storage")
            self.vector_store = None  # Will use in-memory storage
            return True
        except Exception as e:
            print(f"Error connecting to Redis: {e}")
            return False
    
    def index_documents(self, documents: List[Dict[str, Any]]) -> bool:
        """Index documents using LlamaIndex"""
        try:
            # Convert documents to LlamaIndex Document objects
            llama_docs = []
            for doc in documents:
                llama_doc = Document(
                    text=doc.get('content', ''),
                    metadata={
                        'id': doc.get('id', ''),
                        'source': doc.get('source', ''),
                        'section': doc.get('section', ''),
                        'pageNumber': doc.get('pageNumber', 0)
                    }
                )
                llama_docs.append(llama_doc)
            
            # Create index with in-memory storage (fallback mode)
            self.index = VectorStoreIndex.from_documents(
                llama_docs,
                embed_model=self.embed_model
            )
            
            return True
        except Exception as e:
            print(f"Error indexing documents: {e}")
            return False
    
    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Search for relevant documents"""
        try:
            if not self.index:
                return []
            
            query_engine = self.index.as_query_engine(
                similarity_top_k=top_k,
                llm=self.llm
            )
            
            response = query_engine.query(query)
            
            # Extract source nodes
            results = []
            for node in response.source_nodes:
                results.append({
                    'id': node.metadata.get('id', ''),
                    'content': node.text,
                    'score': node.score,
                    'metadata': node.metadata
                })
            
            return results
        except Exception as e:
            print(f"Error searching: {e}")
            return []
    
    def get_stats(self) -> Dict[str, Any]:
        """Get index statistics"""
        try:
            if not self.vector_store:
                return {"error": "Not connected"}
            
            # This would need to be implemented based on Redis vector store capabilities
            return {
                "status": "connected",
                "index_name": self.index_name,
                "redis_url": self.redis_url
            }
        except Exception as e:
            return {"error": str(e)}

def main():
    """CLI interface for testing"""
    if len(sys.argv) < 2:
        print("Usage: python llamaindex_redis.py <command> [args...]")
        print("Commands: connect, index, search <query>, stats")
        sys.exit(1)
    
    retrieval = LlamaIndexRedisRetrieval()
    command = sys.argv[1]
    
    if command == "connect":
        success = retrieval.connect()
        print(json.dumps({"success": success}))
    
    elif command == "index":
        # Read documents from stdin
        documents = json.loads(sys.stdin.read())
        success = retrieval.index_documents(documents)
        print(json.dumps({"success": success}))
    
    elif command == "search":
        if len(sys.argv) < 3:
            print("Usage: search <query>")
            sys.exit(1)
        query = sys.argv[2]
        results = retrieval.search(query)
        print(json.dumps({"results": results}))
    
    elif command == "stats":
        stats = retrieval.get_stats()
        print(json.dumps(stats))
    
    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    main()
