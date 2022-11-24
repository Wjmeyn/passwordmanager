const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/database");
const User = db.User;

module.exports = {
  authenticate,
  getAllUsers,
  getByUsername,
  getUsername,
  addUser,
  addCredential,
  getCredentials,
  deleteCredential,
  getSharedWithMe,
  editCredential,
  getUsernames,
  shareCredential,
  getPin
};

async function authenticate({ username, password }) {
  const user = await User.findOne({ username });
  if (user && bcrypt.compareSync(password, user.hash)) {
    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
    return {
      ...userWithoutHash,
      token,
    };
  }
}

async function getAllUsers() {
  //Returning the result of the promise.
  return await User.find().select("-hash");
}

async function getUsername(userid) {
  let user = await User.findOne({ _id: userid });
  return user.username;
}

async function getPin(userid) {
  let user = await User.findOne({ _id: userid });
  return user.pin;
}

async function getUsernames() {
  let names = [];
  let user = await User.find({});
  for(var i = 0; i < user.length; i++){
    names.push(user[i].username);
  }
  return names;
}

async function getByUsername(username) {
  let user = await User.findOne({ _id: username });
  return [user.firstName, user.lastName];
}

async function addUser(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  } else if (await User.findOne({ email: userParam.email })) {
    throw 'Email "' + userParam.email + '" is already taken';
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await user.save();
}

async function addCredential(credential, username) {
 
    // validate

  if (await User.findOne({ _id: username })) {
    
    let user = await User.findOne({ _id: username });
    let credentials = user.mycredentials;
    for(var i = 0; i <credentials.length; i++){
      if(credentials[i].domain == credential.domain){
        throw "Domain already exists. Edit existing credential";
      }
    }
    credentials.push(credential);

    let record = await User.updateOne(
      { _id: username },
      {
        $set: {
          mycredentials: credentials,
        },
      }
    );

    return "Credential was successfully added!";
  } 
}

async function editCredential(credential, username) {
  // validate
  credential.access = [];

  if (await User.findOne({ _id: username })) {
    
    let user = await User.findOne({ _id: username });
    let credentials = user.mycredentials;
  
    for(var i = 0; i < credentials.length; i++)
    {
      if (credential.domain == credentials[i].domain){

        credentials[i].username = credential.username;
        credentials[i].password = credential.password;

        let record = await User.updateOne(
          { _id: username },
          {
            $set: {
              mycredentials: credentials,
            },
          }
        );
      }
    }


    return "Credential was changed successfully!";
  } 
  
}

async function getCredentials(username) {
  let user = await User.findOne({ _id: username });

  if (user.mycredentials != null) {
    return user.mycredentials;
  } else {
    return "No Credentials found";
  }
}

async function shareCredential(body, username) {
  let user = body[0];
  let credential = body[1];
  console.log(credential);
  console.log(user);
  // validate
credential.access = [];

if (await User.findOne({ _id: username })) {
  
  let user1 = await User.findOne({ _id: username });

  let credentials = user1.mycredentials;

  let sharedwith;
  let access = [];
  for(var i = 0; i < credentials.length; i++)
    {
      if (credential.domain == credentials[i].domain){

        if(credentials[i].access.indexOf(user) >= 0){
          credentials[i].access.splice(credentials[i].access.indexOf(user), 1);
          
          
          let user2 = await User.findOne({ username: user });

          console.log(user2);
          sharedwith = user2.sharedwith;

          
          for(var j = 0; j < sharedwith.length; j++)
          {
            console.log(sharedwith[j]);
            if(sharedwith[j].domain == credential.domain){
              sharedwith.splice(j, 1);
              break;
            }
          }
          
          
          let record = await User.updateOne(
            { _id: username },
            {
              $set: {
                mycredentials: credentials
              },
            }
          );
  
          let record1 = await User.updateOne(
            { username: user },
            {
              $set: {
                sharedwith: sharedwith
              },
            }
          );
          return "Access was removed from: " + user;
          
        }
        else{
          console.log("add:");
          console.log(user);
          console.log(credential);
        (credentials[i].access).push(user);
        console.log("after:");
        console.log(credential);
        let user2 = await User.findOne({ username: user });
        sharedwith = null;
        sharedwith = user2.sharedwith;
        credential.access = null;
        sharedwith.push(credential);

        
        let record = await User.updateOne(
          { _id: username },
          {
            $set: {
              mycredentials: credentials
            },
          }
        );

        let record1 = await User.updateOne(
          { username: user },
          {
            $set: {
              sharedwith: sharedwith
            },
          }
        );

        return "Credential was successfully shared with: " + user;

        }

        

        
      }

      
    }

  
} 
}


async function getSharedWithMe(username) {
    
  let user = await User.findOne({ _id: username });

  if (user.sharedwith != null) {
   
    return user.sharedwith;
  } else {
    return "No Credentials found";
  }
 
}

async function deleteCredential(domain, username) {
  // validate

  let user = await User.findOne({ _id: username });
  let mycredentials = user.mycredentials;
  let shared = user.shared;
  let sharedwith = user.sharedwith;

  //Delete from my credentials
  for (let i = 0; i < mycredentials.length; i++) {
    //Remove credential from my list
    if (mycredentials[i].domain == domain) {
      let users = mycredentials[i].access;
      mycredentials.splice(i, 1);

      //Remove access for users
      for (let a = 0; a < users.length; a++) {
        let thisuser = await User.findOne({ username: users });
        let thisusercredentials = thisuser.sharedwith;
        for (let b = 0; b < thisusercredentials.length; b++) {
          //Remove credential from their list
          if (thisusercredentials[b].domain == domain) {
            thisusercredentials.splice(b, 1);
            b--;
            //Update has access
            let result = await User.updateOne(
              { username: thisuser.username },
              {
                $set: {
                  sharedwith: thisusercredentials,
                },
              }
            );
          }
        }
      }
      i--;

      let result = await User.updateOne(
        { username: user.username },
        {
          $set: {
            mycredentials: mycredentials,
          },
        }
      );
    }
  }

  //Remove from shared with
  for (let j = 0; j < sharedwith.length; j++) {
    if (sharedwith[j].domain == domain) {
      let owner = await User.findOne({ username: sharedwith[j].owner });
      let ownercredentials = owner.mycredentials;
      sharedwith.splice(j, 1);
      for (let a = 0; a < ownercredentials.length; a++) {
        if (ownercredentials[a].domain == domain) {
          let access = ownercredentials[a].access;
          for (let b = 0; b < access.length; b++) {
            if (access[b] == user.username) {
              access.splice(b, 1);

              //Update has access
              ownercredentials[a].access = access;
              let result = await User.updateOne(
                { username: owner.username },
                {
                  $set: {
                    mycredentials: ownercredentials,
                  },
                }
              );
            }
            break;
          }
        }
      }

      //Remove from my shared with
      //Update has access
      let result = await User.updateOne(
        { username: user.username },
        {
          $set: {
            sharedwith: sharedwith
          },
        }
      );
    }
  }

  return "Credential for " + domain + " was successfully removed";
}
