import { describe, expect, it } from "vitest";
import { whatsappMessages, whatsappThreads, whatsappUnread } from "./whatsapp";
import { makeItem } from "./schema";

describe("WhatsApp conversations", () => {
  const messages = [
    makeItem({ id: "incoming", title: "Alice", sender: "Alice", body: "Meet at the station", read: false }),
    makeItem({ id: "outgoing", title: "Alice", sender: "我", body: "OK", outgoing: true, read: false }),
    makeItem({ id: "group", title: "旅行群", sender: "Bob", folder: "群组", body: "照片", read: true }),
    makeItem({ id: "call", title: "Alice", kind: "call", body: "未接通话" }),
    makeItem({ id: "status", title: "状态", folder: "动态", body: "Hello" }),
  ];
  it("keeps call and status records out of chat previews", () => {
    expect(whatsappMessages(messages).map((item) => item.id)).toEqual(["incoming", "outgoing", "group"]);
  });
  it("finds conversations by body and sender, ignoring case and outer spaces", () => {
    expect(whatsappThreads(messages, " STATION ", "全部", [])).toEqual(["Alice"]);
    expect(whatsappThreads(messages, "bob", "全部", [])).toEqual(["旅行群"]);
  });
  it("counts only incoming unread messages and preserves newly arriving unread messages", () => {
    expect(whatsappUnread(messages.slice(0, 2), [])).toBe(1);
    expect(whatsappThreads(messages, "", "未读", ["incoming"])).toEqual([]);
    const next = [...messages, makeItem({ id: "new", title: "Alice", body: "New message", read: false })];
    expect(whatsappThreads(next, "", "未读", ["incoming"])).toEqual(["Alice"]);
  });
  it("combines group filtering with search and handles empty results", () => {
    expect(whatsappThreads(messages, "", "群组", [])).toEqual(["旅行群"]);
    expect(whatsappThreads(messages, "Alice", "群组", [])).toEqual([]);
    expect(whatsappThreads([], "", "全部", [])).toEqual([]);
  });
});

