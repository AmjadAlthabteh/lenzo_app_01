#include <math.h>
#include <stdint.h>

extern "C"
{

  typedef struct
  {
    int on;
    float brightness; // 0..100
    float hue;        // 0..360
    int effect;       // 0=off,1=pulse,2=wave
    float speed;      // Hz-ish
    float amount;     // 0..1
  } Room;

  static Room rooms[4];

  float clampf(float v, float lo, float hi) { return v < lo ? lo : (v > hi ? hi : v); }

  static void hsv_to_rgb(float h, float s, float v, float *r, float *g, float *b)
  {
    float c = v * s;
    float x = c * (1 - fabsf(fmodf(h / 60.0f, 2) - 1));
    float m = v - c;
    float rr = 0, gg = 0, bb = 0;
    if (h < 60)
    {
      rr = c;
      gg = x;
      bb = 0;
    }
    else if (h < 120)
    {
      rr = x;
      gg = c;
      bb = 0;
    }
    else if (h < 180)
    {
      rr = 0;
      gg = c;
      bb = x;
    }
    else if (h < 240)
    {
      rr = 0;
      gg = x;
      bb = c;
    }
    else if (h < 300)
    {
      rr = x;
      gg = 0;
      bb = c;
    }
    else
    {
      rr = c;
      gg = 0;
      bb = x;
    }
    *r = rr + m;
    *g = gg + m;
    *b = bb + m;
  }

  void lux_init()
  {
    for (int i = 0; i < 4; i++)
    {
      rooms[i].on = 1;
      rooms[i].brightness = 60;
      rooms[i].hue = 210;
      rooms[i].effect = 0;
      rooms[i].speed = 1;
      rooms[i].amount = 0;
    }
  }

  void lux_set_room(int idx, int on, float brightness, float hue)
  {
    if (idx < 0 || idx >= 4)
      return;
    rooms[idx].on = on;
    rooms[idx].brightness = clampf(brightness, 0, 100);
    rooms[idx].hue = fmodf(hue, 360.0f);
  }

  void lux_set_effect(int idx, int effect, float speed, float amount)
  {
    if (idx < 0 || idx >= 4)
      return;
    rooms[idx].effect = effect; // 0 off, 1 pulse, 2 wave
    rooms[idx].speed = speed;
    rooms[idx].amount = amount;
  }

  void lux_step(float t)
  {
    for (int i = 0; i < 4; i++)
    {
      Room *r = &rooms[i];
      float mod = 0.0f;
      if (r->effect == 1)
      { // pulse
        mod = sinf(t * 6.28318f * r->speed + i * 0.6f) * r->amount;
      }
      else if (r->effect == 2)
      { // wave (mod hue)
        mod = sinf(t * r->speed + i * 0.6f) * r->amount;
      }
      float b = r->brightness + mod * 20.0f;
      r->brightness = clampf(b, 0.0f, 100.0f);
      if (r->effect == 2)
      {
        r->hue = fmodf(r->hue + mod * 20.0f + 360.0f, 360.0f);
      }
    }
  }

  void lux_get_room_rgb(int idx, float *out_rgb)
  {
    if (idx < 0 || idx >= 4)
      return;
    Room *r = &rooms[idx];
    float v = r->on ? r->brightness / 100.0f : 0.0f;
    float rr, gg, bb;
    hsv_to_rgb(r->hue, 0.8f, v, &rr, &gg, &bb);
    out_rgb[0] = rr;
    out_rgb[1] = gg;
    out_rgb[2] = bb;
  }
}
