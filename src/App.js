import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Loader from "./component/Loader";

function App() {
 
  const [userChunks, setUserChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const remainingUsers = useRef([]);
  const users = useMemo(
    () => userChunks[currentIndex] ?? [],
    [userChunks, currentIndex]
  );

  const getUsers = useCallback(
    async (index = 0) => {
     
      if (userChunks[index]) {
        setCurrentIndex(index);
        return userChunks[index];
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://give-me-users-forever.vercel.app/api/users/${index}/next`
        );
        const { users } = await response.json();
console.log(users,"user")
        setUserChunks((userChunks) => {
          
          const usersClone = [...users];
          const previousUsersCount = remainingUsers.current.length;
          const userChunksClone = [...userChunks];

         
          userChunksClone[index] = [
            ...remainingUsers.current,
            ...usersClone.splice(
              0,
              previousUsersCount ? 10 - previousUsersCount : 10
            ),
          ];
          remainingUsers.current = usersClone;

          return userChunksClone;
        });

        setCurrentIndex(index);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    },
    [userChunks]
  );

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fit flex items-center flex-col app gap-md">
      <>
        <div className="flex gap-sm">
          <button
            onClick={() => getUsers(currentIndex - 1)}
            disabled={currentIndex === 0 || loading}
          >
            Previous Users
          </button>
          <button onClick={() => getUsers(currentIndex + 1)} disabled={loading}>
            Next Users
          </button>
        </div>
        {loading ? (
          <Loader label="Loading" />
        ) : (
          <ul className="users flex flex-col gap-lg">
            {users.map((user) => (
              <li key={user.ID} className="user flex items-center gap-lg">
               
                <ul className="flex flex-col gap-sm">
                  <li className="flex gap-sm">
                    <div className="uppercase user-info-label">Name:</div>
                    <div>{user.FirstNameLastName}</div>
                  </li>
                  <li className="flex gap-sm">
                    <div className="uppercase user-info-label">Company:</div>
                    <div>{user.Company}</div>
                  </li>
                  <li className="flex gap-sm">
                    <div className="uppercase user-info-label">Job Title:</div>
                    <div>{user.JobTitle}</div>
                  </li>
                  <li className="flex gap-sm">
                    <div className="uppercase user-info-label">Phone:</div>
                    <div>{user.Phone}</div>
                  </li>
                  <li className="flex gap-sm">
                    <div className="uppercase user-info-label">Email:</div>
                    <div>{user.Email}</div>
                  </li>
                  <li className="flex gap-sm">
                    <div className="uppercase user-info-label">
                      Email Address:
                    </div>
                    <div>{user.EmailAddress}</div>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        )}
      </>
    </div>
  );
}

export default App;
