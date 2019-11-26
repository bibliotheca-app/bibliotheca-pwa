export const downloadFile = (args: { content: string; type: string; fileName: string }) => {
  const { content, type: mimeType, fileName } = args;

  const file = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.download = fileName;
  a.href = url;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // このタイミングでいいのか？
  URL.revokeObjectURL(url);
};
