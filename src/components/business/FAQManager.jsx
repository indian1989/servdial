// src/components/business/FAQManager.jsx
import { Plus, Trash2, CircleHelp } from "lucide-react";

const emptyFAQ = {
  question: "",
  answer: "",
};

const FAQManager = ({
  value = [],
  onChange,
}) => {

  const faq = Array.isArray(value)
    ? value
    : [];

  const updateFAQ = (
    index,
    field,
    fieldValue
  ) => {

    const updated = [...faq];

    updated[index] = {
      ...updated[index],
      [field]: fieldValue,
    };

    onChange(updated);

  };

  const addFAQ = () => {

    onChange([
      ...faq,
      { ...emptyFAQ },
    ]);

  };

  const removeFAQ = (index) => {

    onChange(
      faq.filter((_, i) => i !== index)
    );

  };

  return (

    <div className="bg-white border rounded-2xl shadow-sm p-6">

      <div className="flex items-center justify-between mb-5">

        <div>

          <div className="flex items-center gap-2">

            <CircleHelp className="text-indigo-600" />

            <h2 className="text-xl font-bold">
              Frequently Asked Questions
            </h2>

          </div>

          <p className="text-sm text-gray-500 mt-1">
            Add common customer questions and answers.
          </p>

        </div>

        <button
          type="button"
          onClick={addFAQ}
          className="
            flex
            items-center
            gap-2
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            px-4
            py-2
            rounded-xl
          "
        >

          <Plus size={18} />

          Add FAQ

        </button>

      </div>

      {

        faq.length === 0 && (

          <div
            className="
              border-2
              border-dashed
              rounded-xl
              py-10
              text-center
              text-gray-400
            "
          >

            No FAQs added

          </div>

        )

      }

      <div className="space-y-5">

        {

          faq.map((item, index) => (

            <div
              key={index}
              className="
                border
                rounded-xl
                p-5
                space-y-4
              "
            >

              <input
                type="text"
                placeholder="Question"
                value={item.question}
                onChange={(e)=>
                  updateFAQ(
                    index,
                    "question",
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-lg
                  p-3
                "
              />

              <textarea
                rows={4}
                placeholder="Answer"
                value={item.answer}
                onChange={(e)=>
                  updateFAQ(
                    index,
                    "answer",
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-lg
                  p-3
                "
              />

              <button
                type="button"
                onClick={() =>
                  removeFAQ(index)
                }
                className="
                  flex
                  items-center
                  gap-2
                  text-red-600
                  hover:text-red-700
                "
              >

                <Trash2 size={18} />

                Remove FAQ

              </button>

            </div>

          ))

        }

      </div>

    </div>

  );

};

export default FAQManager;