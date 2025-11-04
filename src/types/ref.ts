export type OnChange = (changes: {
  target: any;
  action: string | symbol;
  key: any;
  value: any;
  prevValue: any;
}) => void;

export type Ref<T> = {
  value: T;
  onchange: OnChange | undefined;
};

export type Changes = {
  latest: number;
  tick: number;
  scheduled: boolean;
}
