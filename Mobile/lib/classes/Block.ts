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
export class BulletPoint {
  constructor(id: number | null, text: string) {
    this.id = id;
    this.text = text;
    this.textInputHeight = 25;
  }
}
export class BulletList extends Block {
  static preString = "•";
  constructor() {
    super("bulletList", "", {});

    this.text = [{ id: 1, text: "Your text" }];
    this.currentBulletPointId = null;
  }
  upgradeToNumeric() {
    this.blockType = "numericList";
    return this;
  }
}
