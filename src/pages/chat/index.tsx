// array 1 to 20
const arr = Array.from(Array(20).keys());

const Chat = () => {
    return (
        <>
            <main className='flex-row h-screen w-screen bg-blue-600 m-0 p-0 b-0'>
                <div className="bg-yellow-100 h-screen border-2 border-gray-400 p-5 max-w-sm shadow-lg">
                    <div className="font-mono text-lg mb-4 border-b-2 border-gray-400 pb-2">
                        Chat GPT
                    </div>
                    <div className="h-5/6 overflow-auto">
                        {arr.map((item, index) => (
                            <div key={index} className="font-mono text-base mb-4 whitespace-pre-line">
                                {`Conversation ${item}`}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>

    );
};

export default Chat;