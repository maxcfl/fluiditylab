
/* indicates that the solver should be stopped */
var stop;

/**
 * We want to show the solution being generated dynamically, so replace the outer
 * while() loop in the build() method with a timer that checks the stack 
 * every x milliseconds.  This gives the browser a chance to refresh the display; 
 * otherwise it would only show the final state.
 */
function solve()
{
    /* re-seed with a random number */
    rnd.seed = Math.floor(Math.random() * 1000000000);
    
    /* initialize the flag */
    stop = false;
    
    /* Initialize the stack at the first element */
    var stack = [ { x: instance.start.x, y: instance.start.y, neighbors: dirs.shuffle() } ] ;
    
    /* Add a new breadcrumb every zillisecond */
    setTimeout(function() { solver(instance, stack) }, 10);
    
    /* Disable the form button again */
    document.forms.mazeform.slv.disabled = true;
}

/**
 * Indicate we want to stop
 */
function stopSolver()
{
    stop = true;
}

/**
 * Main algorithm to solve the maze
 */
function solver(maze, stack)
{
    if(stop)
    {
        return;    
    }
    
    var current = stack.peek();
    
    x = current.x;
    y = current.y;
    neighbors = current.neighbors;
    var cell = maze.cells[x][y];

    cell.visited = true;
    cell.token.style.backgroundPosition = "center";  
    
    // see if we're at the exit
    if((x == (columns - 1)) && (y == (rows - 1)))
    {
        stopSolver();  // done
        return;
    }  
    
    var found = false;
    
    /* look for a connected neighbor that hasn't been visited yet */
    while(neighbors.length > 0)
    {
        dir = neighbors.pop();
     
        if(cell.wall[dir] == false)
        {            
            dx = x + delta.x[dir];
            dy = y + delta.y[dir];
            if(dx >= 0 && dy >= 0 && dx < columns && dy < rows)
            {
                if(maze.cells[dx][dy].visited == false)
                {
                    stack.push( { x: dx, y: dy, neighbors: dirs.shuffle() } );
                    found = true;
                    break;
                }
            }
        }              
    }
    
    if(neighbors.length == 0)
    {
        if(found == false)
        {
            stack.pop();
            if((x == maze.start.x) && (y == maze.start.y))
            {
                stopSolver(); // we're back at the beginning; must not be able to compelete the maze
            }
            cell.token.style.backgroundImage = "url(../labyrinth/image/checked.png)";
        }
    }
    
    if(! stop)
    {
        setTimeout(function () { solver(maze, stack) }, 10);
    }
}
