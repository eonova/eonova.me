export async function fetchUser(userId: string, referer = ''): Promise<any> {
  const res = await fetch(
    `https://mouban.mythsman.com/guest/check_user?id=${userId}`,
    { headers: { Referer: referer } }
  );
  return res.json();
}
