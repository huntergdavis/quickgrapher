/* Examples
 * */

Examples.push({
    name: "Bill Calculator",
    fxn : "100*(salary - rent - studentloans - carpayments - grocery-spendingmoney-retirement) - netflix -tivo -petfood -gas-electric + 100*(subleaseincome + stockportfolio)",
    url : "salary-rent-studentloans-carpayments-grocery-spendingmoney-retirement-netflix-tivo-petfood-gas-electric+subleaseincome+stockportfolio=0:0:0:0:0:0:0:7:0:0:0:0:0:0:{8000:3400:500:600:1000:500:1000:27:30:200:500:200:1000:1000:}100:100:50:50:20:10:100:3:3:20:30:10:100:50:[4000:400:100:250:300:500:300:13:12:100:120:90:600:100:;0:1:1:1:1:1:1:1:1:1:1:1:1:1:=Bill%20Calculator]"
});

Examples.push({
    name: "Drake Equation",
    fxn : "StarFormationRate * StarsWithPlanets * LifeSustainingPlanets * PlanetsWhichActuallyDevelopLife * PlanetsWithIntelligentLife * CivilizationsWithDetectors * DurationOfSpaceSignals",
    url : "StarFormationRate*StarsWithPlanets*LifeSustainingPlanets*PlanetsWhichActuallyDevelopLife*PlanetsWithIntelligentLife*CivilizationsWithDetectors*DurationOfSpaceSignals=0:0:0:0:0:0:0:{20:1:10:1:1:1:20:}1:0.1:1:0.1:0.1:0.1:1:[10:0.5:2:1:0.1:0.1:10:;1:1:1:1:1:1:1:=Drake%20Equation]"
    
    });

Examples.push({
    name: "Monthly Loan Payments Calculator",
    fxn : "Princpial*((rate/1200)*(1 + rate/1200)^Months)/((1 + rate/1200)^Months - 1)",
    url : "Princpial*((rate/1200)*(1+rate/1200)^Months)/((1+rate/1200)^Months-1)=0:0:0:{200:100:100:}10:1:1:[110:9:23:;1:1:1:=Loan%20Calculator]"
});

Examples.push({
    name: "Force of Gravity",
    fxn : "GravConstant * massOne * massTwo / distance^2",
    url : "GravConstant*massOne*massTwo/distance^2=0:0:0:0:{20:100:100:100:}0.01:1:1:1:[8.73:29:19:3:;1:1:1:1:;Gravity]"
});

Examples.push({
    name: "E = mc^2",
    fxn : "mass*299792458^2",
    url : "mass*299792458^2=0:{100:}1:[20:;1:;E]"
});

Examples.push({
    name: "Area of Circle",
    fxn : "pi * radius^2",
    url : "pi*radius^2=0:{100:}1:[13:;1:=Circle%20Area]"
});

Examples.push({
    name: "Circumference of a Circle",
    fxn : "2*pi*radius",
    url : "2*pi*radius=0:{100:}1:[13:;1:=Circle%20Circumference]"
});

Examples.push({
    name: "Flake Equation (xkcd.com/718)",
    fxn : "7*1000^3 * (CrazyPeople + Misinterpret)/10000 * TellProbability/10 * NumberPeopleTold * FirstHandRetellings * IgnoredDataProbability/10 * WiderAudienceFraction/100",
    url : "7*1000^3*(CrazyPeople+Misinterpret)/10000*TellProbability/10*NumberPeopleTold*FirstHandRetellings*IgnoredDataProbability/10*WiderAudienceFraction/100=0:0:0:0:0:0:0:{10:10:10:100:100:10:100:}1:1:1:1:1:1:1:[1:1:1:10:10:9:1:;1:1:1:1:1:1:1:=Flake%20Equation%20(XKCD)]"
});

Examples.push({
    name: "Dateable Ages (xkcd.com/314)",
    fxn : "Age/2 + 7",
    url : "Age/2+7=18:{126:}1:[27:;1:=Who%20Can%20You%20Date]"
});

Examples.push({
    name: "TV Romantic Drama Equation (Straight) (xkcd.com/216)",
    fxn : "SameSex*(AllCast - SameSex)",
    url : "SameSex*(AllCast-SameSex)=0:0:{100:100:}1:1:[17:44:;1:1:=Romantic%20Pairings]"
});

Examples.push({
    name: "TV Romantic Drama Equation (Gay) (xkcd.com/216)",
    fxn : "AllCast*(AllCast - 1)/2 + SameSex*(SameSex - AllCast)",
    url : "AllCast*(AllCast-1)/2+SameSex*(SameSex-AllCast)=0:0:{100:100:}1:1:[45:25:;1:1:=Romantic%20Pairings]"
});

Examples.push({
    name: "Post-Game Seasonal Batting Average",
    fxn : "(SeasonBats * (SeasonalAverage/100) + Hits)/(SeasonBats + TimesAtBat)",
    url : "(SeasonBats*(SeasonalAverage/100)+Hits)/(SeasonBats+TimesAtBat)=0:0:0:0:{100:100:100:13:}1:1:1:1:[40:60:81:13:;1:1:1:1:=Post%20Game%20Batting%20Average]"
});

Examples.push({
    name: "Focal Length",
    fxn : "(ObjectDistance * LensToImageDistance)/(ObjectDistance + LensToImageDistance)",
    url : "(ObjectDistance*LensToImageDistance)/(ObjectDistance+LensToImageDistance)=0:0:{100:100:}1:1:[37:20:;1:1:=Focal%20Length]"
});

Examples.push({
    name: "Population Growth",
    fxn : "LastYearPopulation + LastYearPopulation*(ReprodiveRate - Attrition)",
    url : "LastYearPopulation+LastYearPopulation*(ReprodiveRate-Attrition)=0:0:0:{10000:1:1:}1:0.01:0.01:[4162:0.37:0.16:;0:1:1:=Population%20Growth]"
});

Examples.push({
    name: "Fiber Optic Response Time",
    fxn : "ProcessingTime + (2*Distance)/(200*(1000^2))",
    url : "ProcessingTime+(2*Distance)/(200*(1000^2))=0:0:{100:100:}1:1:[12:40:;1:1:=Fiber%20Response%20Time]"
});

Examples.push({
    name: "Watts",
    fxn : "Amps * Volts",
    url : "Amps*Volts=0:0:{100:100:}0.01:0.01:[41.04:28.32:;1:1:=Watts]"
});

Examples.push({
    name: "Velocity",
    fxn : "InitialVelocity + Acceleration*Time",
    url : "InitialVelocity+Acceleration*Time=0:0:0:{100:100:100:}1:0.1:1:[42:9.8:10:;1:1:1:=Velocity]"
});

Examples.push({
    name: "Position of a Moving Object",
    fxn : "InitialPosition + InitialVelocity*Time + 1/2 * acceleration * Time^2",
    url : "InitialPosition+InitialVelocity*Time+1/2*acceleration*Time^2=0:0:0:0:{100:100:100:100:}1:1:0.1:0.1:[18:41:31:9.8:;1:1:1:1:=Position]"
});

Examples.push({
    name: "Torque",
    fxn : "radius * force * sin(angle)",
    url : "radius*force*sin(angle)=0:0:-360:{100:100:360:}1:1:1:[19:53:69:;1:1:1:=Torque]"
});

Examples.push({
    name: "Surface Area of Cylinder",
    fxn : "2*pi*radius*length + 2*pi*radius^2",
    url : "2*pi*radius*length+2*pi*radius^2=0:0:{100:100:}1:1:[31:17:;1:1:=Surface%20Area]"
});

Examples.push({
    name: "First Order Derivitive of x^n",
    fxn : "n*x^(n-1)",
    url : "n*x^(n-1)=0:0:{100:100:}1:1:[7:1:;1:1:=Derivative%20of%20x^N]"
});

Examples.push({
    name: "First Order Integral of x^n dx",
    fxn : "1/(n+1) * x^(n+1) + C",
    url : "1/(n+1)*x^(n+1)+C=0:0:0:{100:100:100:}1:1:1:[14:2:10:;1:1:1:=First%20Order%20Integral]"
});

Examples.push({
    name: "Glomerular Filtration Rate (Creatinine Clearance CCr) (Kidney Filtration Rate)",
    fxn : "(CreatineConcentration * FlowRate)/PlasmaConcentration",
    url : "(CreatineConcentration*FlowRate)/PlasmaConcentration=0:0:0:{100:100:100:}1:1:1:[53:31:10:;1:1:1:=Glomular%20Filtration]"
});

Examples.push({
    name: "IPAT Environmental Impact Equation",
    fxn : "Population * Affluence * Technology",
    url : "Population*Affluence*Technology=0:0:0:{100:100:100:}1:1:1:[20:40:31:;1:1:1:=IPAT]"
});

Examples.push({
    name: "Vertical Change Delta for a Weighted String between 2 Points",
    fxn : "sqrt(((StringLength + PointsDistance)/2)*((StringLength - PointsDistance)/2))",
    url : "sqrt(((StringLength+PointsDistance)/2)*((StringLength-PointsDistance)/2))=0:0:{100:100:}1:1:[33:18:;1:1:=Weighed%20String]"
});

Examples.push({
    name: "Gaussian",
    fxn : "a * e^(-1*((x-b)^2/2*c^2))",
    url : "a*e^(-1*((x-b)^2/2*c^2))=0:0:0:0:{100:100:100:100:}1:1:1:1:[8:30:17:5:;1:1:1:1:=Gaussian]"
});

Examples.push({
    name: "Mechanical Work",
    fxn : "1/2 * mass * (secondVelocity^2 - firstVelocity^2)",
    url : "1/2*mass*(secondVelocity^2-firstVelocity^2)=0:0:0:{100:100:100:}1:1:1:[71:34:42:;1:1:1:=Mechanical%20Work]"
});

Examples.push({
    name: "Procrastination Equation",
    fxn : "ExpectationOfSuccess*ValueofCompletion / (ImmediacyOfTask * PersonalDelaySensitivity)",
    url : "ExpectationOfSuccess*ValueofCompletion/(ImmediacyOfTask*PersonalDelaySensitivity)=0:0:0:0:{100:100:100:100:}1:1:1:1:[6:9:6:11:;1:1:1:1:=Procrastination%20Likelihood]"
});

Examples.push({
    name: "Pressure Loss via Friction",
    fxn : "FrictionCoefficient * (length / hydraulicDiameter) * (density * velocity^2 /2)",
    url : "FrictionCoefficient*(length/hydraulicDiameter)*(density*velocity^2/2)=0:0:0:0:0:{0.5:100:100:100:100:}0.001:1:1:1:1:[0.029:13:25:14:20:;1:1:1:1:1:=Pressure%20Loss]"
});

Examples.push({
    name: "Lorentz Factor",
    fxn : "1 / sqrt(1-(velocity^2/c^2))",
    url : "1/sqrt(1-(velocity^2/c^2))=290000000:290000000:{300000000:310000000:}1:[299792000:299792458:;1000:1000:=Lorentz%20Factor]"
});

Examples.push({
    name: "Euclidean Distance in 2D",
    fxn : "sqrt((xTwo-xOne)^2 + (yTwo-yOne)^2)",
    url : "sqrt((xTwo-xOne)^2+(yTwo-yOne)^2)=0:0:0:0:{100:100:100:100:}1:1:1:1:[27:53:40:53:;1:1:1:1:=Euclidean%20Distance]"
});

Examples.push({
    name: "Quadratic Equation (First Solution)",
    fxn : "(-x + sqrt(b^2 - 4*a*c))/2*a",
    url : "(-x+sqrt(b^2-4*a*c))/2*a=0:0:0:0:{100:100:100:100:}1:1:1:1:[5:22:3:5:;1:1:1:1:=Quadratic%20Graph]"
});
Examples.push({
    name: "Complex Parenthesis Function",
    fxn : "sum(b*sin((x^(n-1))*pi),n*sin((x^(n-1))*pi),x^(n-2),(7*x*n))",
    url : "sum(b*sin((x^(n-1))*pi),n*sin((x^(n-1))*pi),x^(n-2),(7*x*n))=-100:-10:-4:{100:100:100:}1:1:1:[-85:-2:15:;1:1:1:=Complex%20Function]"
});
