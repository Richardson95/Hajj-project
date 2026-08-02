"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Select, TextArea, TextInput } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";

const TOPICS = [
  "Opening a savings plan",
  "An existing plan or deposit",
  "KYC / verification",
  "Sponsoring a family member",
  "Applying to sell as a vendor",
  "Group or operator enquiry",
  "Something urgent in Makkah",
  "Press or partnerships",
];

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm() {
  const { toast } = useToast();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    topic: TOPICS[0],
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email))
      next.email = "Enter a valid email address.";
    if (values.message.trim().length < 20)
      next.message = "A little more detail helps us route your message (20+ characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setValues({ name: "", email: "", phone: "", topic: TOPICS[0], message: "" });
      toast({
        title: "Message received",
        description: "A HajjPath agent will reply within one business day, insha'Allah.",
      });
    }, 800);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required error={errors.name} htmlFor="contact-name">
          <TextInput
            id="contact-name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Ibrahim Adetunji"
            autoComplete="name"
            invalid={Boolean(errors.name)}
          />
        </Field>
        <Field label="Email address" required error={errors.email} htmlFor="contact-email">
          <TextInput
            id="contact-email"
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            invalid={Boolean(errors.email)}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Phone number"
          hint="Optional — useful if the matter is urgent."
          htmlFor="contact-phone"
        >
          <TextInput
            id="contact-phone"
            type="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="0803 451 2907"
            autoComplete="tel"
          />
        </Field>
        <Field label="What is this about?" htmlFor="contact-topic">
          <Select
            id="contact-topic"
            value={values.topic}
            onChange={(e) => set("topic", e.target.value)}
          >
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Your message" required error={errors.message} htmlFor="contact-message">
        <TextArea
          id="contact-message"
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us what you need. If it concerns an existing plan, include the beneficiary name."
          rows={6}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={sending} size="lg">
          {sending ? "Sending…" : "Send message"}
          {!sending ? <Send className="size-4" /> : null}
        </Button>
        <p className="text-xs text-muted">
          We reply within one business day. Emergencies in the Kingdom should use the SOS
          button in the app.
        </p>
      </div>
    </form>
  );
}
