interface BindingType {
    routing_key: string
    exchange_name: string
}

export interface QueueInfoType {
    uuid: string
    messages_type: string
    starts_at: string
    expires_at: string
    bindings: BindingType[]
    base_rabbit_admin_url: string
    queue_name: string
    rabbit_server_id: number
}

export interface MessageType {
    payload: string
    timestamp: string
    app_id?: string
    routing_key: string
    headers: Record<string, any>
    exchange: string
}