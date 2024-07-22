const classes = (...args: (string | undefined)[]) =>
  args.filter(Boolean).join(" ");

export default classes;
