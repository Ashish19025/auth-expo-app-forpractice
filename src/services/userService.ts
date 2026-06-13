export const syncUser = async (
  user: any
) => {
  try {
    await fetch(
      "http://192.168.1.5/api/users/sync",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(user),
      }
    );
  } catch (err) {
    console.log(
      "SYNC USER ERROR",
      err
    );
  }
};