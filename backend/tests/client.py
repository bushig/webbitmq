from typing import Any, Optional

from httpx import AsyncClient, Response
from httpx._types import RequestFiles


class AsyncTestClient(AsyncClient):

    async def generic_request(
        self,
        method: str,
        path: str,
        json: Any = None,
        data: Any = None,
        headers: Any = None,
        files: Optional[RequestFiles] = None,
        expected_status: int = 200,
    ) -> Response:
        response = await self.request(method=method, url=path, json=json, data=data, headers=headers, files=files)
        assert (
            response.status_code == expected_status
        ), f"Was expecting {expected_status}, but received {response.status_code}. json: {response.text}"
        return response

    async def generic_request_json(
        self,
        method: str,
        path: str,
        json: Any = None,
        data: Any = None,
        headers: Any = None,
        files: Optional[RequestFiles] = None,
        expected_status: int = 200,
    ) -> Any:
        response = await self.generic_request(method, path, json, data, files, headers, expected_status)
        return response.json()


    async def create_server(
        self,
        data: dict,
        expected_status: int = 200,
    ) -> Any:
        return await self.generic_request_json(
            method="POST",
            path="/api/management/servers/",
            data=data,
            expected_status=expected_status
        )
    async def create_queue(
        self,
        data: dict,
        expected_status: int = 200,
    ) -> Any:
        raise NotImplemented
    async def check_server_connection(
        self,
        server_id: int,
        expected_status: int = 200,
    ) -> Any:

        return await self.generic_request_json(
            method="POST",
            path=f"/api/management/servers/{server_id}/check_connection",
            expected_status=expected_status
        )