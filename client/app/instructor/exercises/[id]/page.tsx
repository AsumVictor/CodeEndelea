export default function ExerciseDetail({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Exercise Detail: {params.id}</h1>
      {/* Add exercise detail functionality here */}
    </div>
  )
}

