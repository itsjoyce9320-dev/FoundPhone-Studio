import type { Item } from "./schema";

export function whatsappMessages(items: Item[]) {
  return items.filter((item) =>
    !["动态", "通话", "社区", "设置"].includes(item.folder) &&
    !["call", "post"].includes(item.kind),
  );
}

export function whatsappUnread(items: Item[], readIds: string[]) {
  return items.filter((item) => !item.outgoing && !item.read && !readIds.includes(item.id)).length;
}

export function whatsappThreads(items: Item[], query: string, filter: string, readIds: string[]) {
  const messages = whatsappMessages(items);
  const needle = query.trim().toLocaleLowerCase();
  return [...new Set(messages.map((item) => item.title))].filter((title) => {
    const thread = messages.filter((item) => item.title === title);
    return thread.some((item) => `${item.title} ${item.sender} ${item.body}`.toLocaleLowerCase().includes(needle)) &&
      (filter !== "未读" || whatsappUnread(thread, readIds) > 0) &&
      (filter !== "群组" || thread.some((item) => item.folder === "群组"));
  });
}
