/**
 * @Author liming
 * @Date 2023/9/17 22:14
 **/
export type Type = any
export type Key = any
export type ElementType = any
export type Ref = any
export type Props = any

export interface ReactElement {
  $$typeof: symbol | number;
  type: ElementType;
  key: Key;
  props: Props;
  ref: Ref;
  __mark: string;
}
