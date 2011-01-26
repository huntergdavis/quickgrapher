/* Examples
 * */

Examples.push({
    name: "Bill Calculator (classic)",
    fxn : "100*(salary - rent - studentloans - carpayments - grocery-spendingmoney-retirement) - netflix -tivo -petfood -gas-electric + 100*(subleaseincome + stockportfolio)",
    URL : "file:///home/programmer/Projects/sliders/quick-graph-less.html?salary-rent-studentloans-carpayments-grocery-spendingmoney-retirement-netflix-tivo-petfood-gas-electric+subleaseincome+stockportfolio=0:0:0:0:0:0:0:7:0:0:0:0:0:0:{8000:3400:500:600:1000:500:1000:27:30:200:500:200:1000:1000:}100:100:50:50:20:10:100:3:3:20:30:10:100:50:[4000:400:100:250:300:500:300:13:12:100:120:90:600:100:;0:1:1:1:1:1:1:1:1:1:1:1:1:1:'Bill%20Calculator]"
});

Examples.push({
    name: "Drake Equation",
    fxn : "StarFormationRate * StarsWithPlanets * LifeSustainingPlanets * PlanetsWhichActuallyDevelopLife * PlanetsWithIntelligentLife * CivilizationsWithDetectors * DurationOfSpaceSignals",
    URL : "file:///home/programmer/Projects/sliders/quick-graph-less.html?StarFormationRate*StarsWithPlanets*LifeSustainingPlanets*PlanetsWhichActuallyDevelopLife*PlanetsWithIntelligentLife*CivilizationsWithDetectors*DurationOfSpaceSignals=0:0:0:0:0:0:0:{20:1:10:1:1:1:20:}1:0.1:1:0.1:0.1:0.1:1:[10:0.5:2:1:0.1:0.1:10:;1:1:1:1:1:1:1:'Drake%20Equation]"
    
    });

Examples.push({
    name: "Monthly Loan Payments Calculator",
    fxn : "Princpial*((rate/1200)*(1 + rate/1200)^Months)/((1 + rate/1200)^Months - 1)",
    URL : "file:///home/programmer/Projects/sliders/quick-graph-less.html?Princpial*((rate/1200)*(1+rate/1200)^Months)/((1+rate/1200)^Months-1)=0:0:0:{200:100:100:}10:1:1:[110:9:23:;1:1:1:'Loan%20Calculator]"
});

Examples.push({
    name: "Gravity",
    fxn : "GravConstant * massOne * massTwo / distance^2",
    URL : ""
});

Examples.push({
    name: "Einstein E=mc2",
    fxn : "mass*(300*1000*1000)^2"
});

Examples.push({
    name: "area of circle",
    fxn : "pi * radius^2"
});

Examples.push({
    name: "circumference of a circle",
    fxn : "2*pi*radius"
});

Examples.push({
    name: "Flake Equation (XKCD)",
    fxn : "7*1000^3 * (CrazyPeople + Misinterpret)/10000 * TellProbability/10 * NumberPeopleTold * FirstHandRetellings * IgnoredDataProbability/10 * WiderAudienceFraction/100"
});

Examples.push({
    name: "Only Date Above (HIMYM/XKCD/OTHERS)",
    fxn : "Age/2 + 7"
});

Examples.push({
    name: "TV Romantic Drama Equation (Gay) (XKCD)",
    fxn : "AllCast*(AllCast - 1)/2 + SameSex*(SameSex - AllCast)"
});

Examples.push({
    name: "TV Romantic Drama Equation (Straight) (XKCD)",
    fxn : "SameSex*(AllCast - SameSex)"
});

Examples.push({
    name: "Post-Game Seasonal Batting Average",
    fxn : "(SeasonBats * (SeasonalAverage/100) + Hits)/(SeasonBats + TimesAtBat)"
});

Examples.push({
    name: "Focal Length",
    fxn : "(ObjectDistance * LensToImageDistance)/(ObjectDistance + LensToImageDistance)"
});

Examples.push({
    name: "Population Growth",
    fxn : "LastYearPopulation + LastYearPopulation*(ReprodiveRate - Attrition)"
});

Examples.push({
    name: "Fiber Optic Response Time",
    fxn : "ProcessingTime + (2*Distance)/(200*(1000^2))"
});

Examples.push({
    name: "Watts",
    fxn : "Amps * Volts"
});

Examples.push({
    name: "Velocity",
    fxn : "InitialVelocity + Acceleration*Time"
});

Examples.push({
    name: "Position of a Moving Object",
    fxn : "InitialPosition + InitialVelocity*Time + 1/2 * acceleration * Time^2"
});

Examples.push({
    name: "torque",
    fxn : "radius * force * sin(angle)"
});

Examples.push({
    name: "Surface area of cylinder",
    fxn : "2*pi*radius*length + 2*pi*radius^2"
});

Examples.push({
    name: "First Order Derivitive of x^n",
    fxn : "n*x^(n-1)"
});

Examples.push({
    name: "First Order Integral of x^n dx",
    fxn : "1/(n+1) * x^(n+1) + C"
});

Examples.push({
    name: "Glomerular filtration rate (Creatinine Clearance CCr) (Kidney Filtration Rate)",
    fxn : "(CreatineConcentration * FlowRate)/PlasmaConcentration"
});

Examples.push({
    name: "IPAT Environmental Impact Equation",
    fxn : "Population * Affluence * Technology"
});

Examples.push({
    name: "Vertical Change Delta for a Weighted String between 2 Points",
    fxn : "sqrt(((StringLength + PointsDistance)/2)*((StringLength - PointsDistance)/2))"
});

Examples.push({
    name: "Gaussian",
    fxn : "a * e^(-1*((x-b)^2/2*c^2))"
});

Examples.push({
    name: "Mechanical Work",
    fxn : "1/2 * mass * (secondVelocity^2 - firstVelocity^2)"
});

Examples.push({
    name: "Procrastination Equation",
    fxn : "ExpectationOfSuccess*ValueofCompletion / (ImmediacyOfTask * PersonalDelaySensitivity)"
});

Examples.push({
    name: "Pressure Loss with friction coefficient .019",
    fxn : ".019 * (length / hydraulicDiameter) * (density * velocity^2 /2)"
});

Examples.push({
    name: "Time Dilation qith Regard to Speed of Observer",
    fxn : "sqrt(1-(velocity^2/(300000)^2))"
});

Examples.push({
    name: "Distance Between 2 Points in 2D space on Grid",
    fxn : "sqrt((xTwo-xOne)^2 + (yTwo-yOne)^2)"
});

Examples.push({
    name: "Quadratic Equation (First Solution)",
    fxn : "(-x + sqrt(b^2 - 4*a*c))/2*a"
});
Examples.push({
    name: "Parenthesis test",
    fxn : "sum(b*sin((x^(n-1))*pi),n*sin((x^(n-1))*pi),x^(n-2),(7*x*n))=-180:0.5:0:{100:1.1:100:}0.5:0.001:0.01:[-111.5:1.069:45.660000000000004:"
});
