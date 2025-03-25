
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Math Tank Mania</h1>
        <p className="text-xl mb-8 max-w-lg">
          Help the tank defeat the villain by solving division problems and collecting coins!
        </p>
        
        <div className="bg-green-50 p-6 rounded-lg shadow-lg mb-8 max-w-xl">
          <h2 className="text-2xl font-bold mb-4 text-green-800">How to Play</h2>
          <ul className="text-left space-y-2">
            <li>• Solve division problems by selecting the correct mine</li>
            <li>• Collect coins for bonus points</li>
            <li>• Correct answers damage the villain</li>
            <li>• Wrong answers damage your tank</li>
            <li>• Defeat the villain before your tank is destroyed!</li>
          </ul>
        </div>
        
        <Button
          onClick={() => navigate("/math-tank-mania")}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-xl rounded-full shadow-lg transition transform hover:scale-105"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
}
