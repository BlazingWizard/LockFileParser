export async function* byLineReader(text: string) {
	for await (const line of text.trim().split("\n")) {
		yield line;
	}
}
