export const syncUser = async (user: {
  clerkId: string;
  firstName?: string;
  lastName?: string;
  email: string;
}) => {
     console.log("SYNC START");
     console.log(user);
  try {
    const response = await fetch(
      'http://192.168.1.5:5000/api/users/sync', // <-- Replace with your PC IP
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }
    );
    console.log("SYNC STATUS");
    console.log(response.status);

    const data = await response.json();

    console.log('SYNC RESPONSE');
    console.log(data);

    return data;
  } catch (err) {
    console.log('SYNC ERROR');
    console.log(err);
  }
};