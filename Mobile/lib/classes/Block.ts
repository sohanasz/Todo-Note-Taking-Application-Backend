class Block {
  constructor(blockType, text, meta) {
    this.id = null;
    this.blockType = blockType;
    this.text = text;
    this.meta = meta;
    this.isFocused = false;
    this.textInputHeight = 100;
  }
}

export class Heading extends Block {
  constructor() {
    super("heading", "Heading", {});
  }
}

export class Paragraph extends Block {
  constructor() {
    super("paragraph", "Paragraph", {});
  }
}
