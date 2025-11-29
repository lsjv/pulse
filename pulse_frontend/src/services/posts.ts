import { api } from "./api";

export async function createPost(content: string) {
  const res = await api.post("/posts/", { content });
  return res.data;
}
