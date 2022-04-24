export interface ContactRequest {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}
export interface BaseEventPayload<T> {
    id: string;
    source: string;
    data: T;
  }