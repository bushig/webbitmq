export interface QueueInfoType {
    uuid: string
    messages_type: string
    routing_key: string
    exchange_name: string
    starts_at: string
    expires_at: string
}

export interface MessageType {
    payload: string
    timestamp: string
}