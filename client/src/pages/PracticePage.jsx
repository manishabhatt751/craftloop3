import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import PracticeModal from '../Components/PracticeModal'

export default function PracticePage() {
  const { practiceId } = useParams()
  const navigate = useNavigate()
  const [practice, setPractice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!practiceId) return
    setLoading(true)
    api
      .getPracticeById(practiceId)
      .then((res) => {
        if (res && res.data) {
          setPractice(res.data)
        }
      })
      .catch((err) => {
        console.error('Failed to load practice:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [practiceId])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <PracticeModal
        isOpen={true}
        onClose={() => {
          if (practice?.course?._id) {
            navigate(`/watchlesson/${practice.course._id}`)
          } else {
            navigate('/mylearning')
          }
        }}
        practiceId={practiceId}
        initialPractice={practice}
        course={practice?.course}
        lesson={practice?.lessonTitle ? { title: practice.lessonTitle } : null}
      />
    </div>
  )
}
