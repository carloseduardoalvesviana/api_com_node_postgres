import { randomUUID } from "node:crypto";

export class DatabaseMemory {
  #videos = new Map();

  list(search) {
    // retorna um objeto Map Iterator
    const values = this.#videos.entries();

    // converter a estrutura para array
    const data = Array.from(values);

    // converter para um formato de objeto json
    const videos = data.map((video) => {
      return {
        id: video[0],
        ...video[1],
      };
    });

    // filtrando pelo titulo caso seja informado o search
    return search ? videos.filter((v) => v.title.includes(search)) : videos;
  }

  create(video) {
    const id = randomUUID();
    this.#videos.set(id, video);
  }

  update(id, video) {
    this.#videos.set(id, video);
  }

  delete(id) {
    this.#videos.delete(id);
  }
}
