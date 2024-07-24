import React from 'react';
import { useForm } from 'react-hook-form';
import { BsCcCircle } from 'react-icons/bs';

const FeatureProfileForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleInputChange = (e, fieldName) => {
    // Custom logic to handle input changes
    console.log(e.target.value, fieldName);
  };

  const featureLevels = [
    { id: 1, level: 'Beginner' },
    { id: 2, level: 'Intermediate' },
    { id: 3, level: 'Expert' },
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h4 className="text-xl font-semibold text-black dark:text-white mb-4">Feature Profile Details</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <div className="flex w-full flex-row gap-4">
            <div className="w-full">
              <label className="block text-black font-medium mb-1">Feature Level *</label>
              <select
                name="feature_level"
                className="outline-none w-full px-4 py-2 border border-black rounded"
                {...register("featureDetails.feature_level")}
                onChange={(e) => handleInputChange(e, 'featureDetails')}
              >
                <option value="">Select feature level</option>
                {featureLevels.map((level) => (
                  <option key={level.id} value={level.level}>
                    {level.level}
                  </option>
                ))}
              </select>
              {errors?.featureDetails?.feature_level && <span className="text-red-600">{errors.featureDetails.feature_level.message}</span>}
            </div>
          </div>
          <div className="flex w-full flex-row gap-4">
            <Input label={"Feature Description *"} name="feature_description" {...register("featureDetails.feature_description")} onChange={(e) => handleInputChange(e, 'featureDetails')} />
            {errors?.featureDetails?.feature_description && <span className="text-red-600">{errors.featureDetails.feature_description.message}</span>}
          </div>
          <div className="flex w-full flex-row gap-4">
            <Input label={"Feature Impact"} name="feature_impact" {...register("featureDetails.feature_impact")} onChange={(e) => handleInputChange(e, 'featureDetails')} />
            {errors?.featureDetails?.feature_impact && <span className="text-red-600">{errors.featureDetails.feature_impact.message}</span>}
          </div>
          <div className="flex w-full flex-row gap-4">
            <div className="w-full">
              <label className="block text-black font-medium mb-1">Feature Category *</label>
              <select
                name="feature_category"
                className="outline-none w-full px-4 py-2 border border-black rounded"
                {...register("featureDetails.feature_category")}
                onChange={(e) => handleInputChange(e, 'featureDetails')}
              >
                <option value="">Select category</option>
                <option value="category 1">Category 1</option>
                <option value="category 2">Category 2</option>
                <option value="category 3">Category 3</option>
              </select>
              {errors?.featureDetails?.feature_category && <span className="text-red-600">{errors.featureDetails.feature_category.message}</span>}
            </div>
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Submit</button>
      </form>
    </div>
  );
};

const Input = ({ label, name, register, onChange }) => (
  <div className="w-full">
    <label className="block text-black font-medium mb-1">{label}</label>
    <input
      type="text"
      name={name}
      className="outline-none w-full px-4 py-2 border border-black rounded"
      {...register}
      onChange={onChange}
    />
  </div>
);

export default FeatureProfileForm;

