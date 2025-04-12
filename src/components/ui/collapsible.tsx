
import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { motion, AnimatePresence } from "framer-motion";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

interface CollapsibleContentProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent> {
  hideAnimation?: boolean;
}

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  CollapsibleContentProps
>(({ hideAnimation, ...props }, ref) => {
  if (hideAnimation) {
    return <CollapsiblePrimitive.CollapsibleContent {...props} ref={ref} />;
  }

  return (
    <CollapsiblePrimitive.CollapsibleContent asChild {...props} ref={ref}>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: "auto", 
          opacity: 1,
          transition: {
            height: { 
              type: "spring",
              stiffness: 500,
              damping: 30,
              duration: 0.4
            },
            opacity: { duration: 0.25 }
          }
        }}
        exit={{ 
          height: 0, 
          opacity: 0,
          transition: {
            height: { duration: 0.3 },
            opacity: { duration: 0.25 }
          } 
        }}
        style={{ overflow: "hidden" }}
      >
        <div>{props.children}</div>
      </motion.div>
    </CollapsiblePrimitive.CollapsibleContent>
  );
});

CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
