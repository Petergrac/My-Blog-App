const Unauthorized = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center w-full">
      <p className="text-center font-bold text-base"> 
        Seems like you are trying to access someone else data.
        <br />
        Make sure you have the correct permission to perform a read or write of
        any article.<br/><span className="text-foreground/55"> Use the navbar to navigate back to homepage.</span>
      </p>
    </div>
  );
};

export default Unauthorized;
