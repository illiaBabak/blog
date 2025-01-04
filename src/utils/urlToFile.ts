export async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
  }

  const blob = await response.blob();

  const file = new File([blob], filename, { type: blob.type });

  return file;
}
