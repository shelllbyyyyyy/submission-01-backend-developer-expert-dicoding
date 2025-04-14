export interface IUseCase<T, K> {
  execute(payload: K): Promise<T>;
}
