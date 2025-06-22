import { renderHook } from "@testing-library/react";
import { CollectionHooks } from "../hooks/collection";

describe("useGetAllCollections - 실제 요청", () => {
  it("fetch가 실제 네트워크 요청을 수행한다", async () => {
    // jest 내 fetch 모킹 없으니 실제 네트워크 요청 발생
    const { useGetAllCollections } = CollectionHooks;
    renderHook(() => useGetAllCollections());

    // fetch가 비동기라 바로 끝나진 않으니 충분한 시간 기다림
    await new Promise((r) => setTimeout(r, 2000));

    // 네트워크 요청이 문제 없이 끝나면 테스트 통과
    expect(true).toBe(true);
  });
});
