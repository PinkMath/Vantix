const modules = import.meta.glob('./*/*.ts', { eager: true }) as Record<string, { default?: Record<string, unknown> }>;

const messages: Record<string, { translation: Record<string, unknown> }> = {};

Object.keys(modules).forEach((path) => {
  const match = path.match(/\.\/([^/]+)\/([^/]+)\.ts$/);
  if (match) {
    const [, lang] = match;
    const mod = modules[path];
    if (!messages[lang]) {
      messages[lang] = { translation: {} };
    }
    if (mod.default) {
      messages[lang].translation = {
        ...messages[lang].translation,
        ...mod.default,
      };
    }
  }
});

export default messages;
