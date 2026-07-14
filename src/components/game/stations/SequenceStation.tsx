"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { SequenceClientConfig } from "@/lib/clientStationTypes";
import { Button } from "@/components/ui/Button";

export function SequenceStation({
  config,
  onAnswer,
  submitting,
}: {
  config: SequenceClientConfig;
  onAnswer: (rawAnswer: { order: string[] }) => void;
  submitting: boolean;
}) {
  const [order, setOrder] = useState(config.steps);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">{config.instruction}</p>
      <Reorder.Group axis="y" values={order} onReorder={setOrder} className="flex flex-col gap-2">
        {order.map((step, i) => (
          <Reorder.Item
            key={step.id}
            value={step}
            as="div"
            className="flex cursor-grab items-center gap-3 rounded-lg border-2 border-line bg-white px-4 py-3 text-sm font-medium text-ink active:cursor-grabbing"
          >
            <motion.span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {i + 1}
            </motion.span>
            {step.text}
            <span className="ml-auto select-none text-muted">⠿</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <Button disabled={submitting} onClick={() => onAnswer({ order: order.map((s) => s.id) })} className="mt-2">
        {submitting ? "Submitting..." : "Lock in order"}
      </Button>
    </div>
  );
}
