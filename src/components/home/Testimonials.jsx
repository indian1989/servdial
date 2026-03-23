import { Star } from "lucide-react";

const Testimonials = ({ reviews = [], loading = false }) => {
  const defaultReviews = [
    {
      name: "Amit Sharma",
      city: "Delhi",
      rating: 5,
      review:
        "ServDial helped me find a reliable electrician within minutes. The search was quick and the contact options made it very easy."
    },
    {
      name: "Priya Verma",
      city: "Mumbai",
      rating: 5,
      review:
        "I found the best restaurant recommendations through ServDial. The reviews and ratings really helped me choose the right place."
    },
    {
      name: "Rahul Singh",
      city: "Patna",
      rating: 4,
      review:
        "The platform is very easy to use and I could directly call businesses from the listings. Very helpful service."
    },
    {
      name: "Neha Gupta",
      city: "Bangalore",
      rating: 5,
      review:
        "I discovered a great beauty salon nearby using ServDial. The GPS based results made the search extremely convenient."
    }
  ];

  const list = reviews.length ? reviews : defaultReviews;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20">
      {/* TITLE */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold">What Our Users Say</h2>
        <p className="text-gray-500 mt-2">
          Thousands of people trust ServDial to discover local businesses.
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="h-60 bg-gray-200 animate-pulse rounded-xl" />
            ))
          : list.map((item, i) => (
              <div
                key={i}
                className="border rounded-xl p-6 hover:shadow-lg transition bg-white"
              >
                <div className="flex mb-3">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-500" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  "{item.review}"
                </p>
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-gray-400 text-xs">{item.city}</p>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default Testimonials;