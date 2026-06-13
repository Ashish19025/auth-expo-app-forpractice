export const syncUser = async (user: {
  clerkId: string;
  firstName?: string;
  lastName?: string;
  email: string;
}) => {
  try {
    const response = await fetch(
      'http://192.168.1.105:5000/api/users/sync', // <-- Replace with your PC IP
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }
    );

    const data = await response.json();

    console.log('SYNC RESPONSE');
    console.log(data);

    return data;
  } catch (err) {
    console.log('SYNC ERROR');
    console.log(err);
  }
};