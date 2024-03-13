import { Graph } from '@antv/g6'

export class CustomGraph extends Graph{
  async transform(options,effectTiming){
    const { tileLodSize } = this.specification.optimize || {};
    await this.hooks.viewportchange.emitLinearAsync({
      transform: options,
      effectTiming,
      tileLodSize,
    });
    this.emit('viewportchange', options);
  }
}