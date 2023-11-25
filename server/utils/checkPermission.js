const checkPermission = (requestUser, resourceUserId) => {
  try {
    if (requestUser.role === "admin") return;
    console.log({ requestUser, resourceUserId });
    if (requestUser.userId === resourceUserId.toString()) return;
  } catch (error) {
    throw new Error({
      status: "Failed",
      msg: "Cannot Perform this action",
      error,
    });
  }
};

module.exports = checkPermission;
