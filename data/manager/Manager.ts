interface Manager {
    connect(): Promise<any>;
    disconnect(): Promise<void>
    clean(): Promise<void>
}

export default Manager
