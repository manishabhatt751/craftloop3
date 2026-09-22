import { useNavigate } from 'react-router-dom';

/**
 * AIRecommendationView
 * Renders structured CraftLoop AI recommendations including Goal, Skills,
 * Real MongoDB Creators, Real Courses, Projects, Tools, and Next Steps.
 */
export default function AIRecommendationView({ recommendation, onSelectPrompt, isViewer = false }) {
  const navigate = useNavigate();

  if (!recommendation) return null;

  const { intent, creators = [], courses = [], projects = [], tools = [], nextSteps = [], followUpPrompts = [] } = recommendation;

  const handleCreatorClick = (creator) => {
    if (isViewer && creator.id) {
      // In viewer mode, direct message with the creator or view their skill profile
      navigate(`/viewermessages/${creator.id}`);
    } else {
      navigate('/skill-profile');
    }
  };

  const handleCourseClick = (course) => {
    if (course.id) {
      navigate(`/viewercoursedetails/${course.id}`);
    } else {
      navigate('/viewercourse');
    }
  };

  const handleProjectClick = () => {
    navigate('/viewerexplore');
  };

  return (
    <div className="mt-4 space-y-5">
      {/* 🎯 Goal & Skills Banner */}
      {intent && (intent.goal || (intent.skills && intent.skills.length > 0)) && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4">
          {intent.goal && (
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700">
              <span>🎯 Your Goal</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium normal-case text-gray-700">"{intent.goal}"</span>
            </div>
          )}

          {intent.skills && intent.skills.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                🧠 Skills You May Need
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {intent.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-lg border border-purple-200 bg-white px-2.5 py-1 text-xs font-medium text-purple-800 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 👤 Recommended Creators (from actual MongoDB User collection) */}
      {creators && creators.length > 0 && (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
              <span>👤 Recommended Creators</span>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
                {creators.length} from database
              </span>
            </h4>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {creators.map((creator) => (
              <div
                key={creator.id}
                className="flex flex-col justify-between rounded-2xl border border-purple-100 bg-white p-4 shadow-sm transition hover:border-purple-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-3">
                    {creator.avatar ? (
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="h-11 w-11 rounded-full object-cover border border-purple-100"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-sm font-bold text-white">
                        {creator.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h5 className="truncate font-semibold text-gray-900 text-sm">{creator.name}</h5>
                      <p className="truncate text-xs text-purple-600 font-medium">
                        {creator.title || 'CraftLoop Creator'}
                      </p>
                    </div>
                  </div>

                  {creator.bio && (
                    <p className="mt-2.5 line-clamp-2 text-xs text-gray-500 leading-relaxed">
                      {creator.bio}
                    </p>
                  )}

                  {creator.skills && creator.skills.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {creator.skills.slice(0, 3).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {creator.skills.length > 3 && (
                        <span className="text-[10px] text-gray-400 self-center">
                          +{creator.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {creator.reason && (
                    <div className="mt-2.5 rounded-lg bg-gray-50 p-2 text-[11px] text-gray-600 border border-gray-100">
                      <span className="font-semibold text-purple-700">Why matched: </span>
                      {creator.reason}
                    </div>
                  )}
                </div>

                <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">CraftLoop Verified</span>
                  <button
                    type="button"
                    onClick={() => handleCreatorClick(creator)}
                    className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-700"
                  >
                    {isViewer ? 'Message / Profile' : 'View Profile'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📚 Recommended Courses (from actual MongoDB Course collection) */}
      {courses && courses.length > 0 && (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
              <span>📚 Recommended Courses</span>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                {courses.length} from database
              </span>
            </h4>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col justify-between rounded-2xl border border-purple-100 bg-white p-4 shadow-sm transition hover:border-purple-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
                      {course.category || 'Course'}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">{course.level || 'Beginner'}</span>
                  </div>

                  <h5 className="mt-2 line-clamp-1 font-bold text-gray-900 text-sm">{course.title}</h5>

                  <p className="mt-1 text-xs text-purple-600">
                    By <span className="font-semibold">{course.creator || 'Instructor'}</span>
                  </p>

                  {course.description && (
                    <p className="mt-2 line-clamp-2 text-xs text-gray-500 leading-relaxed">
                      {course.description}
                    </p>
                  )}

                  {course.reason && (
                    <div className="mt-2.5 rounded-lg bg-gray-50 p-2 text-[11px] text-gray-600 border border-gray-100">
                      <span className="font-semibold text-indigo-700">Relevance: </span>
                      {course.reason}
                    </div>
                  )}
                </div>

                <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">
                    {course.price ? `$${course.price}` : 'Free'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCourseClick(course)}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎨 Recommended Projects / Services */}
      {projects && projects.length > 0 && (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
              <span>🎨 Practical Projects & Services</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                {projects.length} available
              </span>
            </h4>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col justify-between rounded-2xl border border-purple-100 bg-white p-4 shadow-sm transition hover:border-purple-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      {project.category || 'Project'}
                    </span>
                    <span className="text-[11px] text-gray-500">By {project.creator}</span>
                  </div>

                  <h5 className="mt-2 line-clamp-1 font-bold text-gray-900 text-sm">{project.title}</h5>

                  {project.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  {project.tools && project.tools.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.tools.slice(0, 3).map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.reason && (
                    <div className="mt-2.5 rounded-lg bg-gray-50 p-2 text-[11px] text-gray-600 border border-gray-100">
                      <span className="font-semibold text-emerald-700">Why relevant: </span>
                      {project.reason}
                    </div>
                  )}
                </div>

                <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleProjectClick}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Explore Projects
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🛠 Useful Tools */}
      {tools && tools.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            🛠 Useful Industry Tools
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tools.map((tool, index) => (
              <span
                key={index}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-2xs"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ➡️ Suggested Next Steps */}
      {nextSteps && nextSteps.length > 0 && (
        <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-900">
            ➡️ Suggested Next Steps
          </p>
          <ol className="mt-2.5 space-y-1.5 text-xs text-gray-700">
            {nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ❓ Follow-up Question Chips */}
      {followUpPrompts && followUpPrompts.length > 0 && (
        <div className="pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Suggested Follow-up Questions
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {followUpPrompts.map((prompt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelectPrompt && onSelectPrompt(prompt)}
                className="rounded-full border border-purple-200 bg-purple-50/80 px-3.5 py-1.5 text-xs font-medium text-purple-700 transition hover:bg-purple-100 hover:border-purple-300"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
