var tID =0;
var arr = [];


function makeTask() 
{
  const $added = $("#added");
  $added.empty();
 
  for (const added of arr) 
  {
    let t = '';
    
    if (added[1] === 'claimed') 
    {
      t = `<div class="input-group mb-3">
            <div class="input-group-text">
              <input class="form-check-input mt-0" type="checkbox" value="" onclick="compTask(${added[0]})">
            </div>
            <input type="text" class="form-control border border-gray" placeholder="${added[2]}">
            <button type="button" class="btn btn-outline-secondary" onclick="abanTask(${added[0]})">Abandon</button>
          </div>`;
    } 
    else if (added[1] === 'unclaimed') 
    {
      t = `<div class="input-group mb-3">
            <input type="text" disabled class="form-control border border-gray" placeholder="${added[2]}">
            <button type="button" class="btn btn-outline-secondary" onclick="claimTask(${added[0]})">Claim</button>
          </div>`;
    } 
    else if (added[1] === 'finished') 
    {
      t = `<div class="input-group mb-3">
            <div class="input-group-text">
            <input type="checkbox" class="form-check-input mt-0" checked checkbox value="" onclick="remTask(${added[0]})">
            </div>
            <input type="text" class="form-control" placeholder="${added[2]}" aria-label="text inp">
          </div>`;
    }

    $added.append(t);
  }
}


function addTask()
{
  const tInp = $("#task");
  const tTxt = tInp.val();
  
  arr.push([tID, "unclaimed", tTxt]);
  tID = tID + 2;
  tInp.val(null);
  
  makeTask();
}
function claimTask(ent)
{
  arr.forEach(function (added)
  {
    if (added[0] == ent)
    {
      added[1] = 'claimed';
    }
  })

  makeTask();
}

function abanTask(ent) 
{
  for (let i = 0; i < arr.length; i++) 
  {
    if (arr[i][0] == ent) 
    {
      arr[i][1] = 'unclaimed';
    }
  }
  makeTask();
}

function incompTask(ent)
{
  arr.forEach(function (added)
  {
    if (added[0] == ent)
    {
      added[1] = 'claimed';
    }
  })
  
  makeTask();
}
function compTask(ent)
{
  arr.forEach(function (added)
  {
    if (added[0] == ent)
    {
      added[1] = 'finished';
    }
  })
  
  makeTask();
}

function remTask() 
{
  const newarr = [];

  for (let i = 0; i < arr.length; i++) 
  {
    if (arr[i][1] !== 'finished') 
    {
      newarr.push(arr[i]);
    }
  }
  arr = newarr;

  makeTask();
  
}