import {Feature} from "../feature.abstract";
/**
 * Created by bennun on 04/03/2018.
 */

export class WhiteListFeature extends Feature {
  constructor() {
    super('white-list', true);
  }
}
