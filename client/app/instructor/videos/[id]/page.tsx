export default function VideoDetail({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Video Detail: {params.id}</h1>
      {/* Add video detail functionality here */}
    </div>
  )
}

