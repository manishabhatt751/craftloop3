import { useState } from 'react'

function ViewerHelpSupport() {
  const [openFaq, setOpenFaq] = useState(null)
  const [message, setMessage] = useState('')

  const faqs = [
    {
      id: 1,
      question: 'How do I start a course?',
      answer:
        'Go to Courses, select the course you want to learn, and click Start Course.',
    },
    {
      id: 2,
      question: 'Where can I see my courses?',
      answer:
        'You can find all your started courses in the My Learning section.',
    },
    {
      id: 3,
      question: 'How can I contact a creator?',
      answer:
        'Open Messages and select the creator you want to communicate with.',
    },
    {
      id: 4,
      question: 'How does Community work?',
      answer:
        'Community allows viewers and creators to share posts, like content, comment and connect with each other.',
    },
  ]

  const handleSubmit = () => {
    if (!message.trim()) {
      alert('Please enter your message.')
      return
    }

    alert('Your support request has been submitted!')
    setMessage('')
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <section>
        <p className="text-sm font-semibold text-purple-600">
          SUPPORT
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Help & Support
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Find answers or contact the CraftLoop support team.
        </p>
      </section>

      {/* Quick Help */}
      <section className="grid gap-5 md:grid-cols-3">

        <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl">
            ?
          </div>

          <h2 className="mt-5 text-lg font-bold text-gray-900">
            FAQs
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Find quick answers to common questions.
          </p>
        </div>

        <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl">
            ✉
          </div>

          <h2 className="mt-5 text-lg font-bold text-gray-900">
            Contact Support
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Send us a message if you need additional help.
          </p>
        </div>

        <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl">
            ●
          </div>

          <h2 className="mt-5 text-lg font-bold text-gray-900">
            Support Hours
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Monday - Friday
            <br />
            9:00 AM - 6:00 PM
          </p>
        </div>

      </section>

      {/* FAQ */}
      <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>

        <div className="mt-5 space-y-3">

          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="overflow-hidden rounded-2xl border border-purple-100"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenFaq(
                    openFaq === faq.id ? null : faq.id
                  )
                }
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-purple-50"
              >
                <span className="text-sm font-semibold text-gray-900">
                  {faq.question}
                </span>

                <span className="text-lg font-bold text-purple-600">
                  {openFaq === faq.id ? '−' : '+'}
                </span>
              </button>

              {openFaq === faq.id && (
                <div className="border-t border-purple-100 bg-[#faf9ff] px-5 py-4">
                  <p className="text-sm leading-6 text-gray-500">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}

        </div>

      </section>

      {/* Contact Support */}
      <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-900">
          Contact Support
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Tell us what you need help with.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue..."
          rows="5"
          className="mt-5 w-full resize-none rounded-2xl border border-purple-100 bg-[#faf9ff] px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          Submit Request
        </button>

      </section>

    </div>
  )
}

export default ViewerHelpSupport