import { useState } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm MECH X, your automotive assistant. Describe your car issue and I'll help you troubleshoot it. Please include your car's make, model, and year if possible.",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Simulate AI processing with rule-based responses
    setTimeout(() => {
      const response = generateResponse(content);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  return {
    messages,
    sendMessage,
    isProcessing,
  };
}

function generateResponse(userInput: string): string {
  const input = userInput.toLowerCase();

  // Engine issues
  if (input.includes('engine') || input.includes('start')) {
    if (input.includes('won\'t start') || input.includes('not starting')) {
      return `I can help with engine starting issues. Here are common causes and solutions:

**1. Dead Battery**
- Check if lights/radio work
- Try jump-starting the vehicle
- Battery may need replacement if over 3-4 years old

**2. Fuel System Issues**
- Ensure there's fuel in the tank
- Listen for fuel pump priming when turning key
- Check fuel filter condition

**3. Starter Motor Problems**
- Listen for clicking sound when turning key
- Starter may need replacement

**4. Ignition System**
- Check spark plugs and ignition coils
- Verify distributor cap condition (older vehicles)

Would you like me to find nearby mechanics who can help?`;
    }
    if (input.includes('noise') || input.includes('sound')) {
      return `Engine noises can indicate various issues:

**Knocking/Pinging:**
- Use higher octane fuel
- Check for carbon buildup
- Timing may need adjustment

**Squealing:**
- Likely a loose or worn serpentine belt
- Check belt tension and condition

**Rattling:**
- Could be heat shield, exhaust, or internal engine issue
- Inspect exhaust system and engine mounts

**Ticking:**
- May indicate low oil or valve train issues
- Check oil level immediately

I recommend having a mechanic diagnose unusual engine noises. Would you like to find nearby service centers?`;
    }
  }

  // Brake issues
  if (input.includes('brake')) {
    return `Brake issues require immediate attention for safety:

**Squeaking/Squealing:**
- Brake pads may be worn and need replacement
- Brake pad wear indicators are alerting you

**Grinding:**
- Brake pads completely worn - URGENT
- Metal-on-metal contact damaging rotors
- Stop driving and get immediate service

**Soft/Spongy Pedal:**
- Air in brake lines
- Brake fluid leak
- Master cylinder issue

**Vibration When Braking:**
- Warped brake rotors
- Uneven brake pad wear

**Warning Light:**
- Low brake fluid
- ABS system fault
- Parking brake engaged

⚠️ Brake problems are safety-critical. I strongly recommend finding a nearby mechanic immediately. Would you like me to locate service centers near you?`;
  }

  // Transmission issues
  if (input.includes('transmission') || input.includes('gear') || input.includes('shift')) {
    return `Transmission issues can be complex:

**Slipping Gears:**
- Low transmission fluid
- Worn clutch (manual)
- Internal transmission wear

**Hard Shifting:**
- Check transmission fluid level and condition
- Clutch adjustment needed (manual)
- Transmission solenoid issues (automatic)

**Delayed Engagement:**
- Low fluid level
- Transmission filter clogged
- Internal wear

**Fluid Leak:**
- Check under vehicle for red/brown fluid
- Inspect transmission pan gasket
- Check cooler lines

**Maintenance Tips:**
- Check fluid level regularly
- Change transmission fluid per manufacturer schedule
- Address issues early to prevent major damage

Transmission repairs can be expensive. Would you like help finding a transmission specialist nearby?`;
  }

  // Tire/wheel issues
  if (input.includes('tire') || input.includes('wheel') || input.includes('flat')) {
    return `Tire and wheel issues:

**Flat Tire:**
- Use spare tire if available
- Check tire pressure regularly
- Inspect for punctures or damage

**Vibration:**
- Wheels may need balancing
- Check for bent rims
- Tire may have internal damage

**Uneven Wear:**
- Alignment needed
- Improper tire pressure
- Suspension issues

**Tire Pressure Warning:**
- Check all tire pressures including spare
- Inflate to recommended PSI (found on door jamb)
- Inspect for slow leaks

**Maintenance:**
- Rotate tires every 5,000-7,000 miles
- Check pressure monthly
- Replace when tread depth below 2/32"

Need help finding a tire shop or mechanic nearby?`;
  }

  // Electrical issues
  if (input.includes('electrical') || input.includes('light') || input.includes('battery')) {
    return `Electrical system troubleshooting:

**Battery Issues:**
- Test battery voltage (should be 12.6V when off)
- Check for corrosion on terminals
- Battery life typically 3-5 years

**Alternator Problems:**
- Battery warning light on dashboard
- Dimming lights while driving
- Electrical accessories not working properly

**Fuses:**
- Check fuse box for blown fuses
- Replace with same amperage rating
- Recurring blown fuses indicate deeper issue

**Lights Not Working:**
- Check bulbs first
- Inspect fuses
- Check wiring connections

**Starting Issues:**
- Clean battery terminals
- Test battery and alternator
- Check starter motor

Would you like me to find an auto electrician or mechanic near you?`;
  }

  // Overheating
  if (input.includes('overheat') || input.includes('hot') || input.includes('temperature')) {
    return `Engine overheating is serious and requires immediate attention:

**Immediate Actions:**
- Pull over safely and turn off engine
- DO NOT open radiator cap when hot
- Let engine cool for 30+ minutes

**Common Causes:**
- Low coolant level
- Coolant leak
- Thermostat failure
- Water pump failure
- Radiator blockage
- Cooling fan not working

**Check:**
- Coolant level in reservoir (when cool)
- Look for leaks under vehicle
- Check if cooling fan operates
- Inspect radiator for damage

**Prevention:**
- Regular coolant flushes
- Check coolant level monthly
- Address leaks immediately

⚠️ Continued driving with overheating can cause severe engine damage. I recommend getting immediate assistance. Would you like to find nearby mechanics or towing services?`;
  }

  // Check engine light
  if (input.includes('check engine') || input.includes('warning light') || input.includes('dashboard light')) {
    return `Check Engine Light (CEL) information:

**What It Means:**
- Engine control system detected an issue
- Could be minor or serious
- Requires diagnostic scan to identify

**Common Causes:**
- Loose gas cap (try tightening)
- Oxygen sensor failure
- Catalytic converter issues
- Mass airflow sensor problems
- Spark plug/ignition issues

**Flashing CEL:**
- Indicates serious issue (misfire)
- Can damage catalytic converter
- Stop driving and get immediate service

**Solid CEL:**
- Less urgent but needs attention
- Get diagnosed within a few days
- Monitor vehicle performance

**Next Steps:**
- Get OBD-II diagnostic scan
- Many auto parts stores scan for free
- Note any performance changes

Would you like help finding a mechanic who can diagnose the issue?`;
  }

  // AC/Heating
  if (input.includes('ac') || input.includes('air condition') || input.includes('heat') || input.includes('climate')) {
    return `Climate control system issues:

**AC Not Cooling:**
- Low refrigerant (leak possible)
- Compressor not engaging
- Clogged cabin air filter
- Condenser blocked or damaged

**AC Blowing Warm:**
- Refrigerant leak
- Compressor failure
- Blend door actuator issue

**Heater Not Working:**
- Low coolant level
- Thermostat stuck open
- Heater core clogged
- Blend door actuator

**Weak Airflow:**
- Replace cabin air filter
- Blower motor issue
- Ductwork blockage

**Strange Smells:**
- Musty smell: mold in evaporator
- Sweet smell: coolant leak
- Burning smell: electrical issue

**Maintenance:**
- Run AC monthly even in winter
- Replace cabin filter annually
- Check refrigerant level

Need help finding an AC specialist or mechanic?`;
  }

  // Default response
  return `I understand you're experiencing an issue with your vehicle. To provide the most accurate guidance, could you please provide:

1. **Vehicle Information:**
   - Make (e.g., Toyota, Ford, Honda)
   - Model (e.g., Camry, F-150, Civic)
   - Year

2. **Detailed Problem Description:**
   - What symptoms are you experiencing?
   - When does the problem occur?
   - Any warning lights on the dashboard?
   - Any unusual sounds, smells, or vibrations?

3. **Recent Events:**
   - Did this start suddenly or gradually?
   - Any recent maintenance or repairs?

Common issues I can help with:
- Engine problems (won't start, noises, performance)
- Brake issues (squeaking, grinding, soft pedal)
- Transmission problems (shifting, slipping)
- Electrical issues (battery, lights, starting)
- Overheating
- Check engine lights
- AC/Heating problems
- Tire and wheel issues

I can also help you find nearby mechanics and service centers. Just let me know what you need!`;
}
