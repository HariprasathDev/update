const WaveLoader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex space-x-1">
        <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-75"></div>
        <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
};

export default WaveLoader;
