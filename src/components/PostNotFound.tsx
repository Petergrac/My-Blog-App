const PostNotFound = () => {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-semibold">This article(s) does not exist!</h1>
      <p className="text-muted-foreground mt-2">
        The articles you&apos;re looking for does not exist or has been removed.
      </p>
    </div>
  );
};

export default PostNotFound;
